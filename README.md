# moazzam-portfolio

Portfolio website and lightweight backend deployment files.

Repository structure:
- `web2/` contains the live Vercel static site.
- `backend-deploy/` contains the optional FAQ backend deployment files.
- `sync.ps1` commits and pushes only the intended repo contents.

Update workflow:

```powershell
powershell -ExecutionPolicy Bypass -File .\sync.ps1 -Message "describe your change"
```
