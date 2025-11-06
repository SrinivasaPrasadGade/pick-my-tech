# Port 5000 Conflict Fix

On macOS, port 5000 is often used by AirPlay Receiver. The server has been configured to use port 5001 by default instead.

## Options:

1. **Use port 5001 (default)**: The server will run on port 5001
2. **Disable AirPlay Receiver** (if you want to use port 5000):
   - System Preferences → Sharing
   - Uncheck "AirPlay Receiver"
   - Restart the server

3. **Set custom port** in `.env`:
   ```
   PORT=3001
   ```

## Update Frontend

If you change the backend port, make sure to update:
- `client/package.json` proxy setting
- Or set `REACT_APP_API_URL` environment variable in client

