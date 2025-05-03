export interface Task {
  id?: string;
  title: string;
  description: string;
  status: string;
  user: {id:string};  // This property is required in types/Task
  createdAt?: Date;
  updatedAt?: Date;
}
