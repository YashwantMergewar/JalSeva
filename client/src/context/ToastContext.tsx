import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
} from "lucide-react-native";

export type ToastType = "error" | "success" | "info" | "warning";

export interface ToastOptions {
  type?: ToastType;
  title?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, options?: ToastType | ToastOptions) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TOAST_THEMES = {
  error: {
    bg: "#fef2f2",
    border: "#fecaca",
    text: "#991b1b",
    iconColor: "#dc2626",
    accent: "#dc2626",
    defaultTitle: "Error",
    Icon: AlertCircle,
  },
  success: {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    text: "#166534",
    iconColor: "#16a34a",
    accent: "#16a34a",
    defaultTitle: "Success",
    Icon: CheckCircle2,
  },
  warning: {
    bg: "#fffbeb",
    border: "#fde68a",
    text: "#92400e",
    iconColor: "#d97706",
    accent: "#d97706",
    defaultTitle: "Notice",
    Icon: AlertTriangle,
  },
  info: {
    bg: "#eff6ff",
    border: "#bfdbfe",
    text: "#1e40af",
    iconColor: "#2563eb",
    accent: "#2563eb",
    defaultTitle: "Information",
    Icon: Info,
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [type, setType] = useState<ToastType>("error");

  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
    });
  }, [opacity, translateY]);

  const showToast = useCallback(
    (msg: string, options?: ToastType | ToastOptions) => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      let toastType: ToastType = "error";
      let toastTitle: string | undefined = undefined;
      let duration = 4000;

      if (typeof options === "string") {
        toastType = options;
      } else if (options && typeof options === "object") {
        if (options.type) toastType = options.type;
        if (options.title) toastTitle = options.title;
        if (typeof options.duration === "number") duration = options.duration;
      }

      setMessage(msg);
      setTitle(toastTitle);
      setType(toastType);
      setVisible(true);

      translateY.setValue(-100);
      opacity.setValue(0);

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      hideTimeoutRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    },
    [hideToast, opacity, translateY]
  );

  const theme = TOAST_THEMES[type] || TOAST_THEMES.error;
  const IconComponent = theme.Icon;
  const displayTitle = title || theme.defaultTitle;

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              top: Math.max(insets.top, 14),
              transform: [{ translateY }],
              opacity,
            },
          ]}
          pointerEvents="box-none"
        >
          <Pressable
            onPress={hideToast}
            style={[
              styles.toastCard,
              {
                backgroundColor: theme.bg,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={[styles.accentBar, { backgroundColor: theme.accent }]} />
            <View style={styles.contentRow}>
              <View style={styles.iconWrap}>
                <IconComponent size={22} color={theme.iconColor} strokeWidth={2.2} />
              </View>
              <View style={styles.textWrap}>
                <Text style={[styles.titleText, { color: theme.text }]}>
                  {displayTitle}
                </Text>
                <Text style={[styles.messageText, { color: theme.text }]}>
                  {message}
                </Text>
              </View>
              <Pressable
                onPress={hideToast}
                style={styles.closeBtn}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Dismiss notification"
              >
                <X size={16} color={theme.text} strokeWidth={2} />
              </Pressable>
            </View>
          </Pressable>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 9999,
    alignItems: "center",
  },
  toastCard: {
    width: "100%",
    maxWidth: 520,
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  accentBar: {
    height: 4,
    width: "100%",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  iconWrap: {
    marginTop: 1,
  },
  textWrap: {
    flex: 1,
  },
  titleText: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  closeBtn: {
    padding: 4,
    marginLeft: 4,
    alignSelf: "flex-start",
    opacity: 0.7,
  },
});

