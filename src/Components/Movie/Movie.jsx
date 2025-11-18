import './Movie.scss';

function Movie({ image, alt, title, subtitle, onClick, onAddToFavorites, movieId }) {
  const handleAddClick = (e) => {
    e.stopPropagation(); // Останавливаем всплытие события
    if (onAddToFavorites && movieId) {
      onAddToFavorites(movieId);
    }
  };

  return (
    <div className="movie-card" onClick={onClick}>
      <div className="movie-image-wrapper">
        <img src={image} alt={alt} className="movie-image" />
        {(title || subtitle) && (
          <div className="movie-meta">
            {title && <p className="movie-meta-title">{title}</p>}
            {subtitle && <span className="movie-meta-subtitle">{subtitle}</span>}
          </div>
        )}
      </div>
      <div className="add-overlay" onClick={handleAddClick}>
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/71ec7dacc7625eb5eccc40d02d6dc9b1cdd2061b?width=114"
          alt=""
          className="noise-texture"
        />
        <div className="plus-icon">
          <div className="plus-vertical"></div>
          <div className="plus-horizontal"></div>
        </div>
      </div>
    </div>
  );
}

export default Movie;
