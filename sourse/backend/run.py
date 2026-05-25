import ctypes
import os

# Патчим Windows API GetUserProfileDirectoryW напрямую
kernel32 = ctypes.windll.kernel32
kernel32.SetEnvironmentVariableW("APPDATA", "C:\\AppData\\Roaming")
kernel32.SetEnvironmentVariableW("LOCALAPPDATA", "C:\\AppData\\Local")
kernel32.SetEnvironmentVariableW("USERPROFILE", "C:\\AppData")
kernel32.SetEnvironmentVariableW("USERNAME", "user")
kernel32.SetEnvironmentVariableW("HOMEPATH", "\\AppData")

os.makedirs("C:\\AppData\\Roaming\\postgresql", exist_ok=True)
os.makedirs("C:\\AppData\\Local", exist_ok=True)

# Создаём пустой pg_service.conf чтобы psycopg2 не искал его в кириллическом пути
with open("C:\\AppData\\Roaming\\postgresql\\pg_service.conf", "w") as f:
    f.write("")

# Теперь импортируем и запускаем
import uvicorn
uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)