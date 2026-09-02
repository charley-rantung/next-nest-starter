/**
 * Custom error for nodemailer transporter.sendMail() function
 *
 * See documentation for more details:
 * https://nodemailer.com/errors
 */

export interface NodemailerError extends Error {
  /** An error code that identifies the type of error (such as ECONNECTION or EAUTH) */
  code: NodemailerErrorCode;

  /** The SMTP command that was being executed when the error occurred (such as CONN, AUTH LOGIN) */
  command: string;

  /** The raw response string from the SMTP server, if available */
  response?: string;

  /** The numeric SMTP response code from the server (such as 535 for authentication failure) */
  responseCode?: NodemailerResponseCode;

  /** Special case caused by EENVELOPE */
  rejected?: string;

  /** Special case caused by EENVELOPE */
  rejectedErrors?: string[];
}

export type NodemailerErrorCode =
  | 'ECONNECTION' // Connection: Connection closed unexpectedly
  | 'ETIMEDOUT' // Connection: Connection or operation timed out
  | 'EDNS' // Connection: DNS resolution failed
  | 'ESOCKET' // Connection: Socket-level error
  | 'ETLS' // TLS/Security: TLS handshake or STARTTLS failed
  | 'EREQUIRETLS' // TLS/Security: REQUIRETLS not supported (RFC 8689)
  | 'EAUTH' // Authentication: Authentication failed
  | 'ENOAUTH' // Authentication: Authentication not provided
  | 'EOAUTH2' // Authentication: OAuth2 token error
  | 'EENVELOPE' // Envelope: Invalid mail envelope
  | 'EMESSAGE' // Message: Message delivery error
  | 'ESTREAM' // Stream: Stream processing error
  | 'EPROTOCOL' // Protocol: Invalid SMTP server response
  | 'EMAXLIMIT' // Pool: Pool resource limit reached
  | 'ECONFIG' // Configuration: Invalid configuration
  | 'EPROXY' // Proxy: Proxy connection error
  | 'EFILEACCESS' // Content: File access rejected
  | 'EURLACCESS' // Content: URL access rejected
  | 'EFETCH' // Content: HTTP fetch error
  | 'ESENDMAIL' // Transport: Sendmail command error
  | 'ESES'; // Transport: AWS SES error

export type NodemailerResponseCode =
  /** Success codes (2xx) */
  | 220 // Service ready
  | 221 // Service closing transmission channel
  | 235 // Authentication successful
  | 250 // Requested mail action completed
  | 251 // User not local; will forward
  | 252 // Cannot VRFY user, but will accept message
  | 354 // Start mail input

  /** Temporary failure codes (4xx) */
  | 421 // Service not available, closing transmission channel
  | 450 // Requested mail action not taken: mailbox unavailable
  | 451 // Requested action aborted: local error in processing
  | 452 // Requested action not taken: insufficient storage
  | 454 // Temporary authentication failure

  /** Permanent failure codes (5xx) */
  | 500 // Syntax error, command unrecognized
  | 501 // Syntax error in parameters or arguments
  | 502 // Command not implemented
  | 503 // Bad sequence of commands
  | 504 // Command parameter not implemented
  | 530 // Authentication required
  | 535 // Authentication credentials invalid
  | 538 // Encryption required for requested authentication mechanism
  | 550 // Requested action not taken: mailbox unavailable (not found, no access)
  | 551 // User not local; please try forwarding
  | 552 // Requested mail action aborted: exceeded storage allocation
  | 553 // Requested action not taken: mailbox name not allowed (invalid syntax)
  | 554 // Transaction failed (or no SMTP service here)
  | 555; // MAIL FROM/RCPT TO parameters not recognized
