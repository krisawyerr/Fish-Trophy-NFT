import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='navbar'>
      <a href='/'><img src="/logo.png" alt="Fish Trophy" className='logo'/></a>
      <div className='navTabs'>
        {/* <a href='https://opensea.io/'><div>Collection</div></a>
        <a href='https://opensea.io/'><div>Rarity</div></a>
        <a href='/mint'><div>Mint NFT</div></a> */}
        <a href='https://opensea.io/collection/fish-trophy'><div className='opensea'>OpenSea</div></a>
      </div>
    </div>
  )
}

export default Navbar