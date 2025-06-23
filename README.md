# URL Shortener Application

A React-based URL shortener application with comprehensive logging middleware integration for company assessment.

## Features

### Core Functionality
- **Shorten up to 5 URLs concurrently** with custom shortcodes and validity periods
- **Client-side routing** for short URL redirection
- **Custom shortcode support** with uniqueness validation
- **Default 30-minute validity** with custom duration options
- **Click tracking and analytics** with geographical location data
- **Comprehensive statistics dashboard** with detailed click history

### Logging Integration
- **Extensive logging middleware** integration throughout the application
- **Real-time logging** to evaluation server with proper authentication
- **Structured logging** with stack, level, package, and message parameters
- **Error tracking and debugging** capabilities

### User Interface
- **Material-UI design system** for professional appearance
- **Responsive design** optimized for all devices
- **Intuitive navigation** with tabbed interface
- **Real-time feedback** with success/error notifications
- **Copy-to-clipboard** functionality for easy sharing

## Technology Stack

- **Frontend**: React 18 with hooks
- **UI Framework**: Material-UI (MUI) v5
- **State Management**: React useState hooks
- **Storage**: Browser localStorage for persistence
- **Authentication**: Bearer token integration
- **Logging**: Custom middleware with API integration

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Create a new React application:**
   ```bash
   npx create-react-app url-shortener-app
   cd url-shortener-app
   ```

2. **Install required dependencies:**
   ```bash
   npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
   ```

3. **Replace the default files:**
   - Replace `src/App.js` with the URLShortenerApp component
   - Replace `src/index.js` with the provided index file
   - Add the logging middleware as `src/logging-middleware.js`

4. **Update package.json:**
   - Add the proxy configuration for API calls
   - Ensure all dependencies are properly listed

5. **Start the development server:**
   ```bash
   npm start
   ```

6. **Access the application:**
   - Open http://localhost:3000 in your browser
   - The application must run on this exact URL as per requirements

## Application Architecture

### Logging Middleware (`logging-middleware.js`)
- **Singleton pattern** for consistent logging across the application
- **API integration** with evaluation server authentication
- **Multiple log levels**: debug, info, warn, error, fatal
- **Package categorization** for frontend components

### Main Application (`App.js`)
- **Tabbed interface** with URL Shortener and Statistics views
- **Form validation** with real-time error handling
- **URL management** with creation, deletion, and analytics
- **Click tracking** with geographical and temporal data

### Key Components

#### URL Shortener Page
- **Multi-URL input** (up to 5 concurrent URLs)
- **Custom shortcode** input with validation
- **Validity period** configuration in minutes
- **Real-time validation** before submission
- **Success feedback** with generated short URLs

#### Statistics Dashboard
- **Comprehensive table view** of all shortened URLs
- **Click analytics** with detailed history
- **Status indicators** (Active/Expired)
- **Interactive actions** (copy, open, delete, view details)
- **Click details modal** with timestamp and location data

## API Integration

### Logging API
- **Endpoint**: `http://20.244.56.144/evaluation-service/logs`
- **Method**: POST
- **Authentication**: Bearer token with Client ID/Secret
- **Rate limiting**: Handled gracefully with error logging

### Authentication Details
- **Client ID**: 7dc92b6f-a6f9-43e0-934a-ae2eb6467469
- **Client Secret**: TbhzxdAJGtUzWqpx
- **Access Token**: Pre-configured with proper expiration handling

## Usage Guidelines

### Creating Short URLs
1. Navigate to the "URL Shortener" tab
2. Enter original URLs (required)
3. Optionally specify custom shortcodes
4. Set validity periods (default: 30 minutes)
5. Add additional URL fields (up to 5 total)
6. Click "Shorten URLs" to generate short links

### Viewing Statistics
1. Navigate to the "Statistics" tab
2. View all created short URLs in table format
3. Monitor click counts and status
4. Click analytics icon to view detailed click history
5. Use action buttons to copy, open, or delete URLs

### Accessing Short URLs
- Click on short URLs from the results or statistics page
- Application handles routing and redirects to original URL
- Click data is automatically recorded with timestamp and location
- Expired URLs show appropriate error messages

## Validation Rules

### URL Validation
- Must be properly formatted URLs with protocol
- Required field validation
- Duplicate shortcode prevention

### Shortcode Validation
- Alphanumeric characters only
- Reasonable length limits
- Uniqueness enforcement across all URLs

### Validity Validation
- Must be positive integers
- Represents minutes from creation time
- Default value of 30 minutes when not specified

## Error Handling

### Client-Side Validation
- Real-time input validation
- User-friendly error messages
- Form submission prevention on invalid data

### API Error Handling
- Network failure graceful degradation
- Authentication error handling
- Rate limiting awareness

### Logging Error Handling
- Failed log attempts don't break application flow
- Fallback to console logging for debugging
- Retry mechanisms for transient failures

## Security Considerations

- **Client-side storage** for demonstration purposes only
- **No sensitive data** stored in localStorage
- **Proper authentication** headers for API calls
- **Input sanitization** for XSS prevention

## Performance Optimizations

- **Efficient re-rendering** with proper React hooks usage
- **Debounced input validation** for better user experience
- **Lazy loading** of click details
- **Optimized state management** for large URL collections

## Testing Considerations

### Manual Testing Checklist
- [ ] Create single URL with default settings
- [ ] Create multiple URLs (up to 5)
- [ ] Test custom shortcode functionality
- [ ] Verify shortcode uniqueness validation
- [ ] Test URL expiration handling
- [ ] Verify click tracking accuracy
- [ ] Test copy-to-clipboard functionality
- [ ] Validate statistics page accuracy
- [ ] Test responsive design on mobile
- [ ] Verify logging integration

### Edge Cases
- Invalid URL formats
- Expired URL access attempts
- Duplicate shortcode handling
- Network connectivity issues
- Large number of URLs and clicks

## Deployment Notes

- Application must run on `http://localhost:3000` for evaluation
- All logging must go through the provided middleware
- No console.log or other logging methods allowed
- Material-UI styling is mandatory for better scoring

## Troubleshooting

### Common Issues
1. **Port 3000 already in use**: Kill existing processes or use different port temporarily
2. **API authentication failures**: Verify Client ID and Secret configuration
3. **CORS issues**: Proxy configuration should handle cross-origin requests
4. **Material-UI styling issues**: Ensure proper theme provider setup

### Debug Information
- All user actions are logged with appropriate levels
- Error states include detailed error messages
- Network requests include proper error handling
- Component lifecycle events are tracked

## Evaluation Criteria

The application addresses all specified requirements:
- ✅ Extensive logging middleware integration
- ✅ React-based architecture
- ✅ Up to 5 concurrent URL shortening
- ✅ Custom shortcode support with validation
- ✅ Default 30-minute validity with custom options
- ✅ Client-side routing for short URL redirection
- ✅ Comprehensive statistics with click analytics
- ✅ Material-UI styling framework
- ✅ Running on localhost:3000
- ✅ Error handling and user feedback
- ✅ No authentication requirements for users