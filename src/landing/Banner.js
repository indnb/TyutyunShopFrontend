import React, {useState} from 'react';
import {Carousel} from 'react-bootstrap';
import Banner1 from './bc1.jpg';
import Banner2 from './bc2.jpg';
import Banner3 from './bc_3.jpg';
import Banner5 from './bc5.JPG';
import Banner6 from './bc6.JPG';
import Banner7 from './bc7.JPG';
import './Banner.css';

const banners = [
    { image: Banner1, backgroundColor: '#1a1a1a' },
    { image: Banner2, backgroundColor: '#333333' },
    { image: Banner3, backgroundColor: '#4a4a4a' },
    { image: Banner5, backgroundColor: '#4a4a4a' },
    { image: Banner6, backgroundColor: '#4a4a4a' },
    { image: Banner7, backgroundColor: '#4a4a4a' },
];

function Banner() {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setActiveIndex(selectedIndex);
    };

    return (
        <div
            style={{
                marginTop: '56px',
                backgroundColor: banners[activeIndex].backgroundColor,
                transition: 'background-color 0.5s ease',
                position: 'relative',
            }}
        >
            <Carousel
                activeIndex={activeIndex}
                onSelect={handleSelect}
                indicators={false}
                controls={false}
                interval={5000}
            >
                {banners.map((banner, index) => (
                    <Carousel.Item key={index}>
                        <div
                            className="banner-ratio"
                        >
                            <img
                                className="d-block w-100 h-100 cover"
                                src={banner.image}
                                alt=""
                                style={{
                                    filter: 'brightness(0.8)',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
            <CarouselIndicators
                banners={banners}
                activeIndex={activeIndex}
                onSelect={handleSelect}
            />
        </div>
    );
}

function CarouselIndicators({ banners, activeIndex, onSelect }) {
    return (
        <div
            className="carousel-indicators"
            style={{
                position: 'absolute',
                bottom: '20px',
                display: 'flex',
                gap: '10px',
                zIndex: 10,
            }}
        >
            {banners.map((_, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() => onSelect(index)}
                    className={`carousel-indicator ${index === activeIndex ? 'active' : ''}`}
                    aria-current={index === activeIndex}
                />
            ))}
        </div>
    );
}


export default Banner;
