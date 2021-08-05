//FakeDaiBank transfers 5000 FakeDai to Alice and 4000 to bob

//Import Packages
import Web3 from "web3";
import EthTx from "ethereumjs-tx";

//Import cSaiContract and saiTokenContract
import FakeDaiContract from "./FakeDaiContract.mjs";
console.log("1. Modules are imported");

//Set Up Web3
const web3 = new Web3(
    new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    console.log("2. The Provider is Ready")
);

//Declare Your Address and Private Key Variable of the FakeDaiBank
const FAKEDAI_BANK = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1";
const privKey = "4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d";
console.log("3. The Address and Key of FakeDaiBank have been Saved");

//Instantiate the FakeDaiContract
const FakeDaiContractInstance = new web3.eth.Contract(
    (FakeDaiContract.FakeDaiContractABI),
    FakeDaiContract.FakeDaiContractAddress,
    console.log("4. The FakeDaiContract has been instantiated")
);

//Declare the Addresses of Alice and
//const TO_ALICE = "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b";
const TO_BOB = "0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d";
console.log("5. The Address and Key of Alice and Bod have been saved");

//Declare the Amounds for Alice and Bob
//const AMOUND_ALICE = web3.utils.toHex("5000000000000000000000");
const AMOUND_BOB = web3.utils.toHex("4000000000000000000000");
console.log("6. Amounts for Transfer to Alice and Bob has been declared");

//Encode the ABI for the Transfer Function
const transferEncodedABI = FakeDaiContractInstance.methods
  //.transfer(TO_ALICE, AMOUND_ALICE)
  .transfer(TO_BOB, AMOUND_BOB)
  .encodeABI();

//Declare the sendSignedTx Function
function sendSignedTx(transactionObject, cb) {
    let transaction = new EthTx(transactionObject);
    const privateKey = new Buffer.from(privKey, "hex");
    transaction.sign(privateKey);
    const serializedEthTx = transaction.serialize().toString("hex");
    web3.eth.sendSignedTransaction("0x" + serializedEthTx, cb);
}

console.log("7. The sendSignedTx Function has been declared");

//Constract a Transaction Object and Then Execute sendSignedTx
web3.eth.getTransactionCount(FAKEDAI_BANK).then(transactionNonce => {
    const transactionObject = {
        chainId: 1,
        nonce: web3.utils.toHex(transactionNonce),
        gasLimit: web3.utils.toHex(1000000),
        gasPrice: web3.utils.toHex(5000000000),
        from:FAKEDAI_BANK,
        to: FakeDaiContract.FakeDaiContractAddress,
        data: transferEncodedABI,
    };
    console.log("8. The Transaction Object has been constructed")
    
    sendSignedTx(transactionObject, function(error, result) {
        if(error) return console.log("error ===>;", error);
        console.log("sent ===>", result);
    })
    console.log("9. The Transaction for Transfer has been executed")
},  
);

