export interface UserImage {
  link: string | null;
  versions: {
    large: string | null;
    medium: string | null;
    small: string | null;
    micro: string | null;
  };
}

export interface Language {
  id: number;
  name: string;
  identifier: string;
  created_at: string;
  updated_at: string;
}

export interface Campus {
  id: number;
  name: string;
  time_zone: string;
  language: Language;
  users_count: number;
  vogsphere_id: number;
  country: string;
  address: string;
  zip: string;
  city: string;
  website: string;
  facebook: string;
  twitter: string;
  active: boolean;
  public: boolean;
  email_extension: string;
  default_hidden_phone: boolean;
}

export interface CampusUser {
  id: number;
  user_id: number;
  campus_id: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface Cursus {
  id: number;
  created_at: string;
  name: string;
  slug: string;
  kind: string;
}

export interface UserBasic {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  usual_full_name: string;
  usual_first_name: string | null;
  url: string;
  phone: string;
  displayname: string;
  kind: string;
  image: UserImage;
  "staff?": boolean;
  correction_point: number;
  pool_month: string;
  pool_year: string;
  location: string | null;
  wallet: number;
  anonymize_date: string;
  data_erasure_date: string;
  created_at: string;
  updated_at: string;
  alumnized_at: string | null;
  "alumni?": boolean;
  "active?": boolean;
}

export interface CursusUser {
  id: number;
  begin_at: string;
  end_at: string | null;
  grade: string | null;
  level: number;
  skills: any[];
  cursus_id: number;
  has_coalition: boolean;
  blackholed_at: string | null;
  created_at: string;
  updated_at: string;
  user: UserBasic;
  cursus: Cursus;
}

export interface Project {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
}

export interface ProjectUser {
  id: number;
  occurrence: number;
  final_mark: number | null;
  status: string;
  "validated?": boolean | null;
  current_team_id: number;
  project: Project;
  cursus_ids: number[];
  marked_at: string | null;
  marked: boolean;
  retriable_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LanguageUser {
  id: number;
  language_id: number;
  user_id: number;
  position: number;
  created_at: string;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  tier: string;
  kind: string;
  visible: boolean;
  image: string;
  nbr_of_success: number | null;
  users_url: string;
}

export interface IUserProfile {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  usual_full_name: string;
  usual_first_name: string | null;
  url: string;
  phone: string;
  displayname: string;
  kind: string;
  image: UserImage;
  "staff?": boolean;
  correction_point: number;
  pool_month: string;
  pool_year: string;
  location: string | null;
  wallet: number;
  anonymize_date: string;
  data_erasure_date: string;
  created_at: string;
  updated_at: string;
  alumnized_at: string | null;
  "alumni?": boolean;
  "active?": boolean;
  groups: any[];
  cursus_users: CursusUser[];
  projects_users: ProjectUser[];
  languages_users: LanguageUser[];
  achievements: Achievement[];
  titles: any[];
  titles_users: any[];
  partnerships: any[];
  patroned: any[];
  patroning: any[];
  expertises_users: any[];
  roles: Role[];
  campus: Campus[];
  campus_users: CampusUser[];
}
