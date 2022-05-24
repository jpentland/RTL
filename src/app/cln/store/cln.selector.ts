import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Offer } from '../../shared/models/clnModels';
import { CLNState } from './cln.state';

export const clnState = createFeatureSelector<CLNState>('cln');
export const clnNodeSettings = createSelector(clnState, (state: CLNState) => state.nodeSettings);
export const clnNodeInformation = createSelector(clnState, (state: CLNState) => state.information);
export const apiCallStatusNodeInfo = createSelector(clnState, (state: CLNState) => state.apisCallStatus.FetchInfo);
export const allAPIsCallStatus = createSelector(clnState, (state: CLNState) => state.apisCallStatus);
export const payments = createSelector(clnState, (state: CLNState) => ({ payments: state.payments, apiCallStatus: state.apisCallStatus.FetchPayments }));
export const peers = createSelector(clnState, (state: CLNState) => ({ peers: state.peers, apiCallStatus: state.apisCallStatus.FetchPeers }));
export const fees = createSelector(clnState, (state: CLNState) => ({ fees: state.fees, apiCallStatus: state.apisCallStatus.FetchFees }));
export const feeRatesPerKB = createSelector(clnState, (state: CLNState) => ({ feeRatesPerKB: state.feeRatesPerKB, apiCallStatus: state.apisCallStatus.FetchFeeRatesperkb }));
export const feeRatesPerKW = createSelector(clnState, (state: CLNState) => ({ feeRatesPerKW: state.feeRatesPerKW, apiCallStatus: state.apisCallStatus.FetchFeeRatesperkw }));
export const listInvoices = createSelector(clnState, (state: CLNState) => ({ listInvoices: state.invoices, apiCallStatus: state.apisCallStatus.FetchInvoices }));
export const utxos = createSelector(clnState, (state: CLNState) => ({ utxos: state.utxos, apiCallStatus: state.apisCallStatus.FetchUTXOs }));
export const channels = createSelector(clnState, (state: CLNState) => ({ activeChannels: state.activeChannels, pendingChannels: state.pendingChannels, inactiveChannels: state.inactiveChannels, apiCallStatus: state.apisCallStatus.FetchChannels }));
export const balance = createSelector(clnState, (state: CLNState) => ({ balance: state.balance, apiCallStatus: state.apisCallStatus.FetchBalance }));
export const localRemoteBalance = createSelector(clnState, (state: CLNState) => ({ localRemoteBalance: state.localRemoteBalance, apiCallStatus: state.apisCallStatus.FetchLocalRemoteBalance }));
export const forwardingHistory = createSelector(clnState, (state: CLNState) => ({ forwardingHistory: state.forwardingHistory, apiCallStatus: state.apisCallStatus.FetchForwardingHistoryS }));
export const failedForwardingHistory = createSelector(clnState, (state: CLNState) => ({ failedForwardingHistory: state.failedForwardingHistory, apiCallStatus: state.apisCallStatus.FetchForwardingHistoryF }));
export const localFailedForwardingHistory = createSelector(clnState, (state: CLNState) => ({ localFailedForwardingHistory: state.localFailedForwardingHistory, apiCallStatus: state.apisCallStatus.FetchForwardingHistoryL }));
export const nodeInfoAndNodeSettingsAndBalance = createSelector(clnState, (state: CLNState) => ({ information: state.information, nodeSettings: state.nodeSettings, balance: state.balance }));
export const nodeInfoAndBalanceAndNumPeers = createSelector(clnState, (state: CLNState) => ({ information: state.information, balance: state.balance, numPeers: state.peers.length }));
export const nodeInfoAndBalance = createSelector(clnState, (state: CLNState) => ({ information: state.information, balance: state.balance }));
export const nodeInfoAndNodeSettingsAndAPIsStatus = createSelector(clnState, (state: CLNState) => ({ information: state.information, nodeSettings: state.nodeSettings, apisCallStatus: [state.apisCallStatus.FetchInfo, state.apisCallStatus.FetchForwardingHistoryS] }));
export const offers = createSelector(clnState, (state: CLNState) => ({ offers: state.offers, apiCallStatus: state.apisCallStatus.FetchOffers }));
export const offerBookmarks = createSelector(clnState, (state: CLNState) => ({ offersBookmarks: state.offersBookmarks, apiCallStatus: state.apisCallStatus.FetchOfferBookmarks }));
export const getoffer = (bolt12Str) => createSelector(clnState, (state: CLNState) => (state.offers.find((offer: Offer) => offer.bolt12 === bolt12Str)));
