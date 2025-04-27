from mypy_boto3_s3 import S3Client
import boto3
from botocore.client import Config
from botocore.exceptions import ClientError, CredentialRetrievalError
from urllib.parse import urlparse

session = boto3.Session()

s3: S3Client = session.client("s3", 
                              config=Config("s3v4"), 
                              region_name="af-south-1", 
                              endpoint_url="https://s3.af-south-1.amazonaws.com")

def uploadImage(image_file, item_name, bucket_name, s3_directory):
    #uploads an image to s3 and return the url of the image
    try:
        print("Server side: Uploading...")
        s3.upload_fileobj(image_file, bucket_name, f"{s3_directory}/{item_name}")
        print("Server side: Upload complete")
        print(f"https://{bucket_name}.s3.af-south-1.amazonaws.com/{s3_directory}/{item_name}")
        return f"https://{bucket_name}.s3.af-south-1.amazonaws.com/{s3_directory}/{item_name}"
        
    except ClientError as e:
        print(f"Error uploading file: {e}")
        return None
    except CredentialRetrievalError as e:
        print(f"Credentials error: {e}")
        return None

    

async def deleteImage(url: str, bucket_name: str):
    #delete an image from S3 Bucket if user already has an icon. To save storage

    try:
        parsed_url = urlparse(url)
        object_key = parsed_url.path.lstrip('/')
        print("Server side: Deleting...")
        # Extract the object key from the URL
        s3.delete_object(Bucket=bucket_name, Key=object_key)
        print(f"Deleted {object_key} from bucket {bucket_name}")
        return True
    except ClientError as e:
        print(f"Error deleting file: {e}")
        return False
    except CredentialRetrievalError as e:
        print(f"Credentials error: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False
    
#This file is meant to handle uploads to S3 and deleting images from S3. It will be used by main.py.