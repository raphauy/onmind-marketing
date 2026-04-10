/**
 * Colores para templates de email de OnMind Marketing.
 * Valores en HEX para máxima compatibilidad con clientes de email.
 */
export const ONMIND_EMAIL_COLORS = {
  pageBackground: '#f4f4f5',
  cardBackground: '#ffffff',

  primary: '#007056',
  primaryLight: '#ccfbf1',

  textPrimary: '#18181b',
  textSecondary: '#71717a',
  textMuted: '#a1a1aa',
  textWhite: '#ffffff',

  border: '#e4e4e7',
  divider: '#f4f4f5',

  info: '#007056',
  infoBackground: '#f0fdfa',
  infoLight: '#f0fdfa',

  warning: '#d97706',
  warningLight: '#fef3c7',
  error: '#dc2626',
  errorLight: '#fef2f2',

  headerBackground: '#007056',
  footerBackground: '#fafafa',
  mutedSection: '#f4f4f5',
} as const

export const EMAIL_INLINE_STYLES = {
  headerSection: {
    backgroundColor: ONMIND_EMAIL_COLORS.headerBackground,
    color: ONMIND_EMAIL_COLORS.textWhite,
    textAlign: 'center' as const,
    padding: '16px 0',
  },

  pageContainer: {
    backgroundColor: ONMIND_EMAIL_COLORS.pageBackground,
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  },

  cardContainer: {
    backgroundColor: ONMIND_EMAIL_COLORS.cardBackground,
    borderRadius: '8px',
    border: `1px solid ${ONMIND_EMAIL_COLORS.border}`,
    overflow: 'hidden',
  },

  infoAlert: {
    backgroundColor: ONMIND_EMAIL_COLORS.infoLight,
    border: `1px solid ${ONMIND_EMAIL_COLORS.info}`,
    borderRadius: '6px',
    padding: '12px',
  },

  codeSection: {
    backgroundColor: ONMIND_EMAIL_COLORS.mutedSection,
    border: `2px dashed ${ONMIND_EMAIL_COLORS.border}`,
    borderRadius: '8px',
    padding: '12px 16px',
    textAlign: 'center' as const,
  },

  footerSection: {
    backgroundColor: ONMIND_EMAIL_COLORS.footerBackground,
    borderTop: `1px solid ${ONMIND_EMAIL_COLORS.border}`,
    padding: '12px 16px',
  },
} as const
