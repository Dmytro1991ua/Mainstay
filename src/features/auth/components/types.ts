export type FieldConfig<T> = {
  name: keyof T & string;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
};
