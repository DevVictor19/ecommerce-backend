export type Card = {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
};

export type Customer = {
  id: string;
};

export type Charge = {
  id: string;
};

export type CreateCustomerRequest = {
  name: string;
  email: string;
  cpfCnpj: string;
};

export type CreateCustomerResponse = Customer;

export type findCustomerByDocumentResponse = {
  data: Customer[];
};

export type CreateCreditCardChargeRequest = {
  customer: string;
  remoteIp: string;
  billingType: 'CREDIT_CARD';
  value: number;
  dueDate: string;
  installmentCount: number;
  installmentValue: number;
  card: Card;
};

export type CreateCreditCardChargeResponse = Charge;
