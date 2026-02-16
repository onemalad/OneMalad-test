import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadImage(file: File, folder: string): Promise<string> {
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  const storageRef = ref(storage, `${folder}/${filename}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function uploadIssueImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const url = await uploadImage(file, 'issues');
    urls.push(url);
  }
  return urls;
}
