// components/features/BookCarousel.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import BookCard from './BookCard';
import styles from '../../styles/BookCarousel.module.css';

const BookCarousel = ({ books, title, isLoading }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
  });

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  // Referencia para la barra de progreso (manipulación directa del DOM)
  const progressBarRef = useRef(null);

  const scrollLeft = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollRight = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollLeft(emblaApi.canScrollPrev());
    setCanScrollRight(emblaApi.canScrollNext());
  }, [emblaApi]);

  // Actualiza la barra de progreso sin usar estado React
  const onScroll = useCallback(() => {
    if (!emblaApi || !progressBarRef.current) return;
    const progress = emblaApi.scrollProgress(); // valor entre 0 y 1
    const translateX = (progress - 1) * 100;
    progressBarRef.current.style.transform = `translateX(${translateX}%)`;
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    onScroll();

    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
    emblaApi.on('scroll', onScroll);

    // Limpieza
    return () => {
      emblaApi.off('reInit', onSelect);
      emblaApi.off('select', onSelect);
      emblaApi.off('scroll', onScroll);
    };
  }, [emblaApi, onSelect, onScroll]);

  if (isLoading) {
    return (
      <div className={styles.carouselContainer}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.loading}>Cargando...</div>
      </div>
    );
  }

  if (!books?.length) return null;

  return (
    <div className={styles.carouselContainer}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.carousel}>
        {canScrollLeft && (
          <button
            className={`${styles.prevButton} ${styles.visible}`}
            onClick={scrollLeft}
            aria-label="Anterior"
          >
            ‹
          </button>
        )}

        <div className={styles.emblaViewport} ref={emblaRef}>
          <div className={styles.emblaContainer}>
            {books.map((book) => (
              <div key={book._id} className={styles.emblaSlide}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>

        {canScrollRight && (
          <button
            className={`${styles.nextButton} ${styles.visible}`}
            onClick={scrollRight}
            aria-label="Siguiente"
          >
            ›
          </button>
        )}

        <div className={styles.scrollProgress}>
          <div
            className={styles.scrollProgressBar}
            ref={progressBarRef}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(BookCarousel);