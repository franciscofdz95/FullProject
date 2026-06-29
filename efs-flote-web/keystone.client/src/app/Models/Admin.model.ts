export interface Vendor {
  vendor_id: number | null;
  vendor_name: string | null;
  dba: string | null;
  addr: string | null;
  city: string | null;
  state_cd: string | null;
  zip_cd: string | null;
  contact_person: string | null;
  phone_num: string | null;
}

export interface Aircraft {
  aircraft_id: number | null;
  aircraft_type: string | null;
  wing_span: string | null;
  len_overall: string | null;
  fuel_type: string | null;
  payload: number | null;
  num_engines: number | null;
  cubic_capacity: number | null;
  cruise_speed: number | null;
  range_miles: number | null;
  is_taxable: boolean | null;
}

export interface States {
  code: string;
  name: string;
}
