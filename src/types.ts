export interface IStudent {
  id: number;
  slug?: any;
  name: string;
  dob: string;
  register_date?: string;
  status: string;
  parents: string;
  address: string;
  phone: string;
  email?: string;
  facebook?: string;
  note: string;
  fee?: {
    gift?: {
      id: string;
      label: string;
    };
    amount?: number;
    discount?: number;
    end_date?: string;
    pay_date?: string;
    unit_num?: number;
    unit_used?: number;
    start_date?: string;
  };
  avatar: any;
  created_at?: string;
  updated_at?: string;
}

export interface IClass {
  id: number;
  class_id: string;
  name: string;
  is_open: boolean;
  day_of_week: number;
  start_at: string;
  end_at: string;
  type: string;
  created_at?: string;
  updated_at?: string;
  location: string;
  teacher: number[];
  student: number[];
}

export interface IRequestStudents {
  location?: string;
  dayOfWeek?: number | string;
  classes?: number | string;
  classType?: string;
  status?: string;
  pageSize?: number;
  pageNumber?: number;
}

export interface IRequestBank {
  pageSize?: number;
  pageNumber?: number;
}

export interface IVietcomBank {
  username?: number|string;
  password?: number|string;
  timeRange?: any;
}
