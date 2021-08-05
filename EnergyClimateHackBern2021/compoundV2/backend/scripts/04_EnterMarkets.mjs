//Import Packages
import Web3 from "web3";
import EthTx from "ethereumjs-tx";

//Import Comptroller and FakecDaiContract
import FakeComptroller from "./FakeComptroller.mjs";
import FakecDaiContract from "./FakecDaiContract.mjs";
console.log("1. Modules are imported");

//Set Up Web3
const web3 = new Web3(
    new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    console.log("2. The Provider is Ready")
);

//Declare Your Address and Private Key Variable of ALICE
//const ADDRESS_ALICE = "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b";
//const privKeyA = "6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c";
const ADDRESS_BOB = "0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d";
const privKeyB = "646f1ce2fdad0e6deeeb5c7e8e5543bdde65e86029e2fd9fc169899c440a7913";
console.log("3. The Address and Key of ALICE and BOB have been Saved");

//Instantiate the FakeComptroller
const FakeComptrollerInstance = new web3.eth.Contract(
    (FakeComptroller.FakeComptrollerABI),
    FakeComptroller.FakeComptrollerAddress,
    console.log("4. The FakeComptroller has been instantiated")
);

//Instantiate the FakecDaiContract
const FakecDaiContractInstance = new web3.eth.Contract(
    (FakecDaiContract.FakecDaiContractABI),
    FakecDaiContract.FakecDaiContractAddress,
    console.log("5. The FakecDaiContract has been instantiated")
);

//Declare a const Variable to pass to the Enter cTOKEN Market Function
const ΕΝΤΕR_MARKETS = [FakecDaiContract.FakecDaiContractAddress];

// Create the encoded ABI of the enter markets function
const EnterMarketsEncodedABI = FakeComptrollerInstance.methods
  .enterMarkets(ΕΝΤΕR_MARKETS)
  .encodeABI();
  console.log("6. ABI encoded for enter markets");

//Declare the sendSignedTx Function for EnterMarkets and Borrow
function sendSignedTx(transactionObject, cb) {
    let transaction = new EthTx(transactionObject);
    const privateKey = new Buffer.from(privKeyB, "hex");
    transaction.sign(privateKey);
    const serializedEthTx = transaction.serialize().toString("hex");
    web3.eth.sendSignedTransaction("0x" + serializedEthTx, cb);
}

console.log("7. The sendSignedTx Function for EnterMarkets has been declared");

//Constract a Transaction Object and Then Execute sendSignedTx
web3.eth.getTransactionCount(ADDRESS_BOB).then(transactionNonce => {
    const transactionObject = {
        chainId: 1,
        nonce: web3.utils.toHex(transactionNonce),
        gasLimit: web3.utils.toHex(1000000),
        gasPrice: web3.utils.toHex(5000000000),
        from:ADDRESS_BOB,
        to: FakeComptroller.FakeComptrollerAddress,
        data: EnterMarketsEncodedABI,
    };  

    sendSignedTx(transactionObject, function(error, result) {
        if(error) return console.log("error ===>;", error);
        console.log("sent ===>", result);
    })

},
    console.log("8. The Transaction Object for EnterMarkets has been constructed")
);