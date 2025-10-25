export interface Country {
  id: number;
  uid: string;
  name: string;
  slug: string;
  official_name: string;
  capital: string;
  iso_alpha_2: string;
  iso_alpha_3: string;
  iso_numeric: number;
  international_phone: string;
  flag_emoji: {
    css: string;
    hex: string;
    img: string;
    html: string;
    utf8: string;
    uCode: string;
    utf16: string;
    decimal: string;
    shortcode: string;
  };
}
