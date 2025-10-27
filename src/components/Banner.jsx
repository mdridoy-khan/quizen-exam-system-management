import React from "react"
const Banner = ({ image, alt = 'Banner Image' }) => {
    return (
        <div>
            <img 
                src={image}
                alt={alt} 
                className="w-full object-cover object-center h-[450px]"
            />
        </div>
    )
}
export default Banner