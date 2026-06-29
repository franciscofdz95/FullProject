export interface Paramlist {
  //Main parameters
  accountingyearval: Number;
  accountingmonthval: Number;
  displaycurrentval: String;
  locationtypeval: String;
  inputadvval: String;
  origdestval: String;
  invoicestatval: String;
  accrualstatval: String;
  costtypeval: String;
  scandestval: String;
  paidstatusval: String;
  vendorcodeval: String;
  //Advanced filters
  countryval: String;
  companycodeval: String;
  locationcodeval: String;
  originval: String;
  destinationval: String;
  batchidval: String;
  startdateval: Date | null;
  mblcostbasisval: String;
  mblnumberval: String;
  containernumberval: String;
  shipmentnumval: String;
  carrierbolval: String;
  chargecodeval: String;
  billstatusval: String;
  enddateval: Date | null;
  paidstatusadvval: String;
  servicecodeval: String;
  chargestatusval: String;
  costtypeadvval: String;
  vendorcodeadvval: String;
  invoicerefnoval: String;
  origdestadvval: String;
  receiveddateval: Date | null;
  e2kcarrierval: String;
  //Paid Differently
  paiddifferentlyval: String;
  loccountrypaidval: String;
  locationregval: String;
  shipmentOrigval: String;
  shipmentDestval: String;
  reasonval: String;
  serviceval: String;
  vendorNameval: String;
  masterbillval: String;
  //
}
