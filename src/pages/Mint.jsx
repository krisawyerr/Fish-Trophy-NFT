import Navbar from '../components/Navbar'
import NFTAbi from '../ContractsData/MyNFT.json'
import NFTAddress from '../ContractsData/MyNFT-address.json'
import { useEffect, useState } from 'react'
import { ethers } from "ethers"

const Mint = () => {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [tokenMaster, setTokenMaster] = useState(null)
  const [myNFT, setMyNFT] = useState()
  const [toggle, setToggle] = useState(false)
  const [toggle2, setToggle2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [owner, setOwner] = useState()
  const [nftCost, setNftCost] = useState(0)
  const [mintError, setMintError] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0);
  const interval = 750;
  

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'matic')
    setProvider(provider)
  
    const network = await provider.getNetwork()
    const tokenMaster = new ethers.Contract(NFTAddress.address, NFTAbi, provider)
    setTokenMaster(tokenMaster)
    setOwner(await tokenMaster.owner())
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

    let odds
    if (nftCost === 5) {
      odds = [34, 11, 3]
    } else {
      odds = [75, 50, 25]
    }
    
    let rarity
    if (percent >= odds[0]) {
      rarity = 0
    } else if (percent < odds[0] && percent >= odds[1]) {
      rarity = 1
    } else if (percent < odds[1] && percent >= odds[2]) {
      rarity = 2
    } else if (percent < odds[2]) {
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
    setMintError('')

    const uri = `https://${folderAndDomain[1]}.mypinata.cloud/ipfs/${folderAndDomain[0]}/${nft}.json`
    const nftImage = `https://nft-server-ten.vercel.app/out/${nft}.png`
    setMyNFT(nftImage)

    const signer = await provider.getSigner()

    const valueInWei = ethers.utils.parseEther(`${nftCost}`);

    try {
      const transaction = await tokenMaster.connect(signer).createNFT(uri, { value: valueInWei });
      await transaction.wait();
      setToggle(true);
    } catch (error) {
      console.error("Error minting NFT:", error);
      if (error instanceof TypeError && error.message.includes("Cannot read properties of null")) {
        setMintError("Make sure your wallet is on the polygon network!");
        setAccount(null)
      } else if (error.data.message.includes("insufficient funds for gas * price + value")) {
        setMintError("Insufficient funds!");
      }
    } finally {
      setLoading(false);
    }
  }

  const withdraw = async () => {
    setToggle(false)
    setToggle2(false)
    setLoading(true)
    setMintError('')

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

  console.log(nftCost)

  return (
    <>
      <Navbar />
      <div className='mintPage'>
        <div className='slideshowGrid'>
            <div className="slideshow">
              {slides.map((slide, index) => (
                <div key={index} className={index === currentSlide ? 'slide active' : 'slide'}>
                  <img src={slide} alt={`Slide ${index}`}/>
                </div>
              ))}
            </div>
        </div>

        <div className='formSection'>
          <div className='formCard'>
            <h2>Mint your Fish Trophy</h2>

            <div className='price'>
              <div>{nftCost} Matic</div>
              <div>Sale is active!</div>
            </div>

            <div className='rarityChange'>
              <input type="checkbox" onChange={() => setNftCost(nftCost === 0 ? 5 : 0)} checked={nftCost !== 0}/>
              <div>Increse Rarity Probability: +5 Matic</div>
            </div>

            {loading ? (
              <button>Loading...</button>
            ) : (
              account ? (
                <button onClick={mintNFT}>Mint Random Fish Trophy</button>
              ) : (
                <button onClick={connectHandler}>Connect to MetaMask</button>
              )
            )}
            
            {mintError !== '' && <p className='mintError'>{mintError}</p>}
            {toggle && (
              <>
                <p className='thanks'>Thanks for buying!</p>
                <h1>Your NFT:</h1>
                <a href={`https://opensea.io/${account}`}><img src={`${myNFT}`} alt="" height={200} width={200}/></a>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Mint