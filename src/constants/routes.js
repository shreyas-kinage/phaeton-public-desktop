import Dashboard from "@components/dashboard/dashboard";
import TransactionPage from "@components/transactionPage/transactionPage";
import Login from "@components/login/login";
import Logout from "@components/logout/logout";
import Remove from "@components/removeAccount/removeAccount";
import NewAccount from "@components/newAccount/newAccount";
import VerifySeed from "@components/newAccount/verifySeed";
import MakePassword from "@components/makePassword/password";
import Account from "@components/importAccount/importAccount";
import SignSeed from "@components/signSeed/signSeed";
import StartPage from "@components/startPage/startPage";
import SeedPhrase from "@components/importAccount/seedPhrase/seedPhrase";
import PrivateKey from "@components/importAccount/privateKey/privateKey";
import Preloader from "@subcomponents/preloader/preloader";
import ExportAccount from "@components/exportAccount/exportAccount";
import MonitorTransactions from "@components/explorer/transactions/transactions";
import Blocks from "@components/explorer/blocks/blocks";
import DelegatesMonitor from "@components/explorer/delegates/delegates";
import BlockDetails from "@components/explorer/blockDetails/blockDetails";
import AccountDetails from "@components/explorer/accounts/accountDetails";
import VoteUnvoteDetails from "@components/vote/voteUnvoteDetails";
import Voting from "@components/vote/voting";
import RegisterDelegateModal from "@modals/registerDelegateModal";

export default {
  dashboard: {
    path: "/dashboard",
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
    component: Dashboard, //
  },
  logout: {
    path: "/logout",
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
    component: Logout, //
  },
  login: {
    path: "/login",
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
    component: Login, //
  },
  remove: {
    path: "/remove",
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
    component: Remove, //
  },
  getstarted: {
    path: "/getstarted",
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
    component: StartPage, //
  },
  newaccount: {
    path: "/newaccount",
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
    component: NewAccount, //
  },
  verifyseed: {
    path: "/verifyseed",
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
    component: VerifySeed, //
  },
  makepassword: {
    path: "/makeapassword",
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
    component: MakePassword, //
  },
  signinseed: {
    path: "/signinviaseed",
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
    component: SignSeed, //
  },
  preloader: {
    path: "/",
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
    component: Preloader,
  },
  importaccount: {
    path: "/importaccount",
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
    component: Account, //
  },
  importviaprivate: {
    path: "/importaccount/via-private-key",
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
    component: PrivateKey,
  },
  importviaseed: {
    path: "/importaccount/via-seed-phrase",
    isPrivate: false,
    forbiddenTokens: [],
    exact: true,
    component: SeedPhrase, //
  },
  transaction: {
    path: "/transaction",
    exact: true,
    isPrivate: false,
    forbiddenTokens: [],
    component: TransactionPage,
  },
  exportaccount: {
    path: "/exportaccount",
    exact: true,
    isPrivate: false,
    forbiddenTokens: [],
    component: ExportAccount, //
  },
  voting: {
    path: "/voting",
    exact: true,
    isPrivate: false,
    forbiddenTokens: [],
    component: Voting,
  },
  votingDetails: {
    path: "/vote",
    exact: true,
    isPrivate: false,
    forbiddenTokens: [],
    component: VoteUnvoteDetails,
  },
  registerDelegate: {
    path: "/registerdelegate",
    exact: true,
    isPrivate: false,
    forbiddenTokens: [],
    component: RegisterDelegateModal,
  },
  alltransactions: {
    path: "/alltransactions",
    exact: true,
    isPrivate: false,
    forbiddenTokens: [],
    component: MonitorTransactions,
  },
  blocks: {
    path: "/blocks",
    exact: true,
    isPrivate: false,
    forbiddenTokens: [],
    component: Blocks,
  },
  blockByID: {
    path: "/block",
    isPrivate: false,
    exact: true,
    forbiddenTokens: [],
    component: BlockDetails,
  },
  account: {
    path: "/account",
    exact: true,
    isPrivate: false,
    forbiddenTokens: [],
    component: AccountDetails,
  },
  delegate: {
    path: "/delegates",
    exact: true,
    isPrivate: false,
    forbiddenTokens: [],
    component: DelegatesMonitor,
  },
};
