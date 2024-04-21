import NFTAbi from './frontend/contractsData/MyNFT.json'
import NFTAddress from './frontend/contractsData/MyNFT-address.json'
import { useEffect, useState } from 'react'
import { ethers } from "ethers"
import './App.css';

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [tokenMaster, setTokenMaster] = useState(null)
  const [myNFT, setMyNFT] = useState()
  const [toggle, setToggle] = useState(false)
  const [toggle2, setToggle2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [owner, setOwner] = useState()
  const [mintError, setMintError] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0);
  const interval = 1000;
  

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    const tokenMaster = new ethers.Contract(NFTAddress.address, NFTAbi, provider)
    setTokenMaster(tokenMaster)
    setOwner(await tokenMaster.owner())

    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  console.log(account)
  console.log(owner)

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)
  }

  function randomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function rartityPicker() {
    const percent = randomInt(100)
    
    let rarity
    if (percent >= 34) {
      rarity = 0
    } else if (percent < 34 && percent >= 11) {
      rarity = 1
    } else if (percent < 11 && percent >= 3) {
      rarity = 2
    } else if (percent < 3) {
      rarity = 3
    }

    return rarity
  }

  const mintNFT = async () => {
    const randNums = [rartityPicker(), randomInt(3), rartityPicker(), rartityPicker(), rartityPicker()]
    const nft = `bg${randNums[0]}${randNums[1]}board${randNums[2]}blob${randNums[3]}badge${randNums[4]}`
    const nftNumber = `${randNums[0]}${randNums[1]}${randNums[2]}${randNums[3]}${randNums[4]}`

    let folderAndDomain
    if (parseInt(nftNumber) >= 20023) {
      folderAndDomain = ['QmY49Fn34irGr4AhN8SFpiBKYejqUqQPabpFQQb5YpLE8W', 'aquamarine-hidden-gopher-338']
    } else {
      folderAndDomain = ['QmUB8WHqStSDW21m6FUfndcTLMmsfkwSAgE3oGZoMK8B3Z', 'copper-kind-coyote-634']
    }

    setToggle(false)
    setToggle2(false)
    setLoading(true)
    setMintError(false)

    const uri = `https://${folderAndDomain[1]}.mypinata.cloud/ipfs/${folderAndDomain[0]}/${nft}.json`
    const nftImage = `https://nft-server-ten.vercel.app/out/${nft}.png`
    setMyNFT(nftImage)

    const signer = await provider.getSigner()

    let valueInWei;  
    if (owner === account) {
      valueInWei = ethers.utils.parseEther("0");      
    } else {
      valueInWei = ethers.utils.parseEther("7");  
    }

    try {
      const transaction = await tokenMaster.connect(signer).createNFT(uri, { value: valueInWei});
      await transaction.wait()
      setToggle(true)
    } catch (error) {
      console.error("Error minting NFT:", error);
      setMintError(true);
    } finally {
      setLoading(false)
    }
  }

  const withdraw = async () => {
    setToggle(false)
    setToggle2(false)
    setLoading(true)
    setMintError(false)

    const signer = await provider.getSigner()
    const transaction = await tokenMaster.connect(signer).withdraw();
    await transaction.wait()

    setToggle2(true)
    setLoading(false)
  }

  const slides = [
    'https://nft-server-ten.vercel.app/out/bg12board3blob0badge3.png',
    'https://nft-server-ten.vercel.app/out/bg01board2blob3badge0.png',
    'https://nft-server-ten.vercel.app/out/bg20board1blob2badge3.png',
    'https://nft-server-ten.vercel.app/out/bg31board0blob1badge2.png',
    'https://nft-server-ten.vercel.app/out/bg22board3blob0badge1.png',
    'https://nft-server-ten.vercel.app/out/bg00board0blob2badge0.png',
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [slides.length, interval]);

  return (
    <>
      <div>
        <div className="slideshow">
          {slides.map((slide, index) => (
            <div key={index} className={index === currentSlide ? 'slide active' : 'slide'}>
              <img src={slide} alt={`Slide ${index}`} height={500} width={500}/>
            </div>
          ))}
        </div>
      </div>

      <div className='formSection'>
        <div className='formCard'>
          <div className='price'>
            <div>0 Matic</div>
            <h2 style={{margin: 0}}>Fish Trophy NFT</h2>
            <div>Sale is active!</div>
          </div>
          {loading ? (
            <button style={{backgroundColor: "#ff0000"}}>Loading...</button>
          ) : (
            account ? (
              <button onClick={mintNFT}>Mint Random Fish Trophy</button>
            ) : (
              <button onClick={connectHandler}>Connect to MetaMask</button>
            )
          )}
          {mintError && <p className='mintError'>Minting NFT Failed!</p>}
          {toggle && (
            <>
              <p>Thanks for buying</p>
              <h1>Your NFT:</h1>
              <img src={`${myNFT}`} alt="" height={200} width={200}/>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default App
