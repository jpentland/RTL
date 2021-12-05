import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import { CLOfferInformation } from '../../../../shared/models/alertData';
import { TimeUnitEnum, CurrencyUnitEnum, TIME_UNITS, CURRENCY_UNIT_FORMATS, PAGE_SIZE, APICallStatusEnum, CLActions } from '../../../../shared/services/consts-enums-functions';
import { SelNodeChild } from '../../../../shared/models/RTLconfig';
import { GetInfo } from '../../../../shared/models/clModels';
import { CommonService } from '../../../../shared/services/common.service';

import { RTLState } from '../../../../store/rtl.state';
import { saveNewOffer } from '../../../store/cl.actions';
import { clNodeInformation, clNodeSettings } from '../../../store/cl.selector';

@Component({
  selector: 'rtl-cl-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.scss']
})
export class CLCreateOfferComponent implements OnInit, OnDestroy {

  public faExclamationTriangle = faExclamationTriangle;
  public selNode: SelNodeChild = {};
  public description = '';
  public expiry: number;
  public offerValue: number;
  public offerValueHint = '';
  public offerPaymentReq = '';
  public offers: any;
  public information: GetInfo = {};
  public private = false;
  public expiryStep = 100;
  public pageSize = PAGE_SIZE;
  public timeUnitEnum = TimeUnitEnum;
  public timeUnits = TIME_UNITS;
  public selTimeUnit = TimeUnitEnum.SECS;
  public offerError = '';
  private unSubs: Array<Subject<void>> = [new Subject(), new Subject(), new Subject(), new Subject(), new Subject()];

  constructor(public dialogRef: MatDialogRef<CLCreateOfferComponent>, @Inject(MAT_DIALOG_DATA) public data: CLOfferInformation, private store: Store<RTLState>, private decimalPipe: DecimalPipe, private commonService: CommonService, private actions: Actions) { }

  ngOnInit() {
    this.pageSize = this.data.pageSize;
    this.store.select(clNodeSettings).pipe(takeUntil(this.unSubs[0])).subscribe((nodeSettings: SelNodeChild) => {
      this.selNode = nodeSettings;
    });
    this.store.select(clNodeInformation).pipe(takeUntil(this.unSubs[1])).subscribe((nodeInfo: GetInfo) => {
      this.information = nodeInfo;
    });
    this.actions.pipe(
      takeUntil(this.unSubs[2]),
      filter((action) => action.type === CLActions.UPDATE_API_CALL_STATUS_CL)).
      subscribe((action: any) => {
        if (action.type === CLActions.UPDATE_API_CALL_STATUS_CL && action.payload.action === 'SaveNewOffer') {
          if (action.payload.status === APICallStatusEnum.ERROR) {
            this.offerError = action.payload.message;
          }
          if (action.payload.status === APICallStatusEnum.COMPLETED) {
            this.dialogRef.close();
          }
        }
      });
  }

  onAddOffer(form: any) {
    this.offerError = '';
    if (!this.offerValue) {
      this.offerValue = 0;
    }
    let expiryInSecs = (this.expiry ? this.expiry : 3600);
    if (this.selTimeUnit !== TimeUnitEnum.SECS) {
      expiryInSecs = this.commonService.convertTime(this.expiry, this.selTimeUnit, TimeUnitEnum.SECS);
    }
    this.store.dispatch(saveNewOffer({
      payload: {
        label: ('ulbl' + Math.random().toString(36).slice(2) + Date.now()), amount: this.offerValue * 1000, description: this.description, expiry: expiryInSecs, private: this.private
      }
    }));
  }

  resetData() {
    this.description = '';
    this.offerValue = null;
    this.private = false;
    this.expiry = null;
    this.offerValueHint = '';
    this.selTimeUnit = TimeUnitEnum.SECS;
    this.offerError = '';
  }

  onOfferValueChange() {
    if (this.selNode.fiatConversion && this.offerValue > 99) {
      this.offerValueHint = '';
      this.commonService.convertCurrency(this.offerValue, CurrencyUnitEnum.SATS, CurrencyUnitEnum.OTHER, this.selNode.currencyUnits[2], this.selNode.fiatConversion).
        pipe(takeUntil(this.unSubs[3])).
        subscribe({
          next: (data) => {
            this.offerValueHint = '= ' + data.symbol + this.decimalPipe.transform(data.OTHER, CURRENCY_UNIT_FORMATS.OTHER) + ' ' + data.unit;
          }, error: (err) => {
            this.offerValueHint = 'Conversion Error: ' + err;
          }
        });
    }
  }

  onTimeUnitChange(event: any) {
    if (this.expiry && this.selTimeUnit !== event.value) {
      this.expiry = this.commonService.convertTime(this.expiry, this.selTimeUnit, event.value);
    }
    this.selTimeUnit = event.value;
  }

  ngOnDestroy() {
    this.unSubs.forEach((completeSub) => {
      completeSub.next(null);
      completeSub.complete();
    });
  }

}