import './Series.scss';

function Series({ image, alt, title, subtitle, onClick, onAddToFavorites, doramaId }) {
  const handleAddClick = (e) => {
    e.stopPropagation(); // Останавливаем всплытие события
    if (onAddToFavorites && doramaId) {
      onAddToFavorites(doramaId);
    }
  };

  return (
    <div className="series-card" onClick={onClick}>
      <div className="series-image-wrapper">
        <img src={image} alt={alt} className="series-image" />
        {(title || subtitle) && (
          <div className="series-meta">
            {title && <p className="series-meta-title">{title}</p>}
            {subtitle && <span className="series-meta-subtitle">{subtitle}</span>}
          </div>
        )}
      </div>
      <div className="series-add-overlay" onClick={handleAddClick}>
        <img 
          src="https://api.builder.io/api/v1/image/assets/TEMP/71ec7dacc7625eb5eccc40d02d6dc9b1cdd2061b?width=114" 
          alt="" 
          className="series-noise-texture" 
        />
        <div className="series-plus-icon">
          <div className="series-plus-vertical"></div>
          <div className="series-plus-horizontal"></div>
        </div>
      </div>
    </div>
  );
}

export default Series;
