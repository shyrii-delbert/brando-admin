export interface PhotoField {
  imageFile: File,
  title: string;
  description: string;
  isPost: boolean;
}

export interface FormField {
  mainArea: string;
  subArea: string;
  date: Date;
  photos: PhotoField[];
}