import { UUID } from "../interfaces/types";

type PaymentCardTokenCardholderIdentificationType = {
  number: string;
  type: string;
};

type PaymentCardTokenCardholderType = {
  identification: PaymentCardTokenCardholderIdentificationType;
  name: string;
};

export type PaymentCardTokenType = {
  id: string;
  public_key: string;
  first_six_digits: string;
  expiration_month: number;
  expiration_year: number;
  last_four_digits: string;
  cardholder: PaymentCardTokenCardholderType;
  status: string;
  date_created: string;
  date_last_updated: string;
  date_due: string;
  luhn_validation: boolean;
  live_mode: boolean;
  require_esc: boolean;
  card_number_length: number;
  security_code_length: number;
};

export type PaymentCreateCardTokenType = {
  cardNumber: string;
  cardholderName: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  securityCode: string;
  identificationType: string;
  identificationNumber: string;
};

type PaymentMethodsPayerCostsType = {
  installment_rate: number;
  discount_rate: number;
  min_allowed_amount: number;
  labels: any[];
  installments: number;
  reimbursement_rate: any;
  max_allowed_amount: number;
  payment_method_option_id: string;
};

type PaymentMethodsIssuerType = {
  installment_rate: number;
  discount_rate: number;
  min_allowed_amount: number;
  labels: any[];
  installments: number;
  reimbursement_rate: any;
  max_allowed_amount: number;
  payment_method_option_id: string;
};

type PaymentMethodsFinancingDealsType = {
  legals: any;
  installments: any;
  expiration_date: any;
  start_date: any;
  status: string;
};

type PaymentMethodsSettingsSecurityCodeType = {
  mode: string;
  card_location: string;
  length: number;
};

type PaymentMethodsSettingsCardNumberType = {
  length: number;
  validation: string;
};

type PaymentMethodsSettingsBinType = {
  pattern: string;
  installments_pattern: string;
  exclusion_pattern: string;
};

type PaymentMethodsSettingsType = {
  security_code: PaymentMethodsSettingsSecurityCodeType;
  card_number: PaymentMethodsSettingsCardNumberType;
  bin: PaymentMethodsSettingsBinType;
};

type PaymentMethodsPagingType = {
  total: number;
  limit: number;
  offset: number;
};

type PaymentMethodsResultsType = {
  financial_institutions: any[];
  secure_thumbnail: string;
  payer_costs: PaymentMethodsPayerCostsType[];
  issuer: PaymentMethodsIssuerType;
  total_financial_cost: boolean;
  min_accreditation_days: number;
  max_accreditation_days: number;
  merchant_account_id: any;
  id: string;
  payment_type_id: string;
  accreditation_time: number;
  thumbnail: string;
  bins: any[];
  marketplace: string;
  deferred_capture: string;
  agreements: any[];
  labels: string[];
  financing_deals: PaymentMethodsFinancingDealsType;
  name: string;
  site_id: string;
  processing_mode: string;
  additional_info_needed: string[];
  status: string;
  settings: PaymentMethodsSettingsType[];
};

export type PaymentMethodsType = {
  paging: PaymentMethodsPagingType;
  results: PaymentMethodsResultsType[];
};

type PaymentIssuerType = {
  id: string;
  name: string;
  secure_thumbnail: string;
  thumbnail: string;
  processing_mode: string;
  merchant_account_id: null;
  status: string;
};

export type PaymentIssuersType = PaymentIssuerType[];

type PaymentInstallmentIssuerType = {
  id: string;
  name: string;
  secure_thumbnail: string;
  thumbnail: string;
};

type PaymentInstallmentPayerCostsType = {
  installments: number;
  installment_rate: number;
  discount_rate: number;
  reimbursement_rate: any;
  labels: string[];
  installment_rate_collector: string[];
  min_allowed_amount: number;
  max_allowed_amount: number;
  recommended_message: string;
  installment_amount: number;
  total_amount: number;
  payment_method_option_id: string;
};

type PaymentInstallmentType = {
  payment_method_id: string;
  payment_type_id: string;
  issuer: PaymentInstallmentIssuerType;
  processing_mode: string;
  merchant_account_id: any;
  payer_costs: PaymentInstallmentPayerCostsType[];
  agreements: null;
};

export type PaymentInstallmentsType = PaymentInstallmentType[];

export type PaymentFormType = {
  cardholderName?: string;
  documentType?: string;
  document?: string;
  cardNumber?: string;
  cardExpiration?: string;
  securityCode?: string;
  paymentOption?: string;
  paymentMethod?: PaymentMethodsResultsType;
  issuer?: PaymentIssuerType;
  installmentOptions?: PaymentInstallmentPayerCostsType[];
};

type PaymentIdentificationType = {
  id: string;
  name: string;
  type: string;
  min_length: number;
  max_length: number;
};

export type PaymentIdentificationsType = PaymentIdentificationType[];

export interface PaymentDataType extends PaymentFormType {
  profileID: UUID;
  eventID: UUID;
  installments: number;
  issuer_id: string;
  identification: {
    type: string;
    number: string;
  },
  payment_method_id: string;
  token: string;
}