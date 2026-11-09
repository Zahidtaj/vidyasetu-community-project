import os
import socket
from app import create_app
from app.models import db, User

app = create_app()

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        if User.query.count() == 0:
            from seed_data import seed_database
            seed_database()

    port = int(os.environ.get('PORT', 5000))
    local_ip = get_local_ip()

    print("\n==================================================================")
    print("VidyaSetu Digital Library Platform Running!")
    print(f"Local Laptop:  http://127.0.0.1:{port}")
    print(f"Phone / Wi-Fi: http://{local_ip}:{port}")
    print("==================================================================\n")
    
    # 0.0.0.0 allows other devices on the same Wi-Fi (phone, tablet, other laptops) to connect
    app.run(host='0.0.0.0', port=port, debug=False)
