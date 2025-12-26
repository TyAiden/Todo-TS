export interface Todo {
  id: number;
  name: string;
  completed: boolean;
  createdAt?: string;
}

export interface TodoProps extends Todo {
  toggleTaskCompleted: (id: number) => void;
  deleteTask: (id: number) => void;
  editTask: (id: number, newName: string) => void;
}

export interface FormProps {
  addTask: (name: string) => Promise<void>;
}

export interface FilterButtonProps {
  name: string;
  isPressed: boolean;
  setFilter: (name: string) => void;
}

export interface ImportExportProps {
  onExport: () => Promise<void>;
  onImport: (file: File) => Promise<void>;
}
