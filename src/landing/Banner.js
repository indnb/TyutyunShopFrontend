import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import BannerZero from './bc1.jpg';
import BannerOne from './bc2.jpg';
import BannerTwo from './bc3.JPG';

const banners = [
    { image: BannerZero, backgroundColor: '#1a1a1a' },
    { image: BannerOne, backgroundColor: '#333333' },
    { image: BannerTwo, backgroundColor: '#4a4a4a' },
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
                            className="ratio"
                            style={{
                                '--bs-aspect-ratio': '50%',
                                maxHeight: '1100px',
                            }}
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
                    style={{
                        backgroundColor: index === activeIndex ? '#FFA500' : '#1a1a1a',
                        border: '1px solid #FFA500',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                    }}
                />
            ))}
        </div>
    );
}

export default Banner;
