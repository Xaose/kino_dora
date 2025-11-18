import './Studios.scss';

function Studios() {
  const studios = [
    {
      name: 'HBO',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/948fd01e810ef2faff3e66e65dd2a24b547a8146?width=246',
      alt: 'HBO'
    },
    {
      name: 'Warner Bros',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/6d80ecb0e68d369e2c0dda9dcfa572bd20c8f012?width=220',
      alt: 'Warner Bros'
    },
    {
      name: 'Disney',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/14542a5a2f9baa6b7ed385e51e80fa34e5f567ad?width=378',
      alt: 'Disney+'
    },
    {
      name: 'Marvel',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/5c2df995d87fcf107111360bd54c19c961e9e84b?width=286',
      alt: 'Marvel'
    },
    {
      name: 'DC',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/4f7773c1f962191ae01b0b510701dfc5764350cd?width=220',
      alt: 'DC'
    },
    {
      name: 'AMC',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/ea30c9c3fc938e26e5a9633ae7554b41ff241f37?width=260',
      alt: 'AMC'
    },
    {
      name: 'Netflix',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/e117397b79601d33099401963551674ce4af92c8?width=272',
      alt: 'Netflix'
    },
    {
      name: 'Paramount',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/d5cda3f9d4f7ddc20aa2e9262fa16700f37ba25a?width=288',
      alt: 'Paramount'
    },
    {
      name: 'Sony',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/e8dac2b0e99fe4ddf92d22f79744d085e9bff608?width=342',
      alt: 'Sony'
    },
    {
      name: 'Apple TV+',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/0c8a58af4c28cbee87c251909a2816b9dd2142f1?width=264',
      alt: 'Apple TV+'
    }
  ];

  return (
    <section className="studios-section" id="studios-section">
      <h2 className="studios-title">Студии</h2>
      
      <div className="studios-grid">
        {studios.map((studio, index) => (
          <div key={index} className="studio-card">
            <img src={studio.image} alt={studio.alt} className="studio-logo" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Studios;
