ssh -i /Users/williamdvorak/Documents/Business/OpenInclude/deployment/dvorak.pem ubuntu@ec2-50-17-38-198.compute-1.amazonaws.com
git pull https://github.com/skier31415/OpenInclude
python manage.py runserver 0.0.0.0:8000
ec2-50-17-38-198.compute-1.amazonaws.com:8000