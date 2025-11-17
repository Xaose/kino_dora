import { useMemo, useState } from 'react';
import './Pricing.scss';
import Header from '../../Components/Header/Header';
import FAQ from '../../Components/FAQ/FAQ';
import Footer from '../../Components/Footer/Footer';

const plans = [
  {
    id: 'basic',
    name: 'Р‘Р°Р·Р°',
    durationMonths: 3,
    amount: 15.14,
    pricePerMonth: 5.05,
    description: 'Р”Р»СЏ Р·РЅР°РєРѕРјСЃС‚РІР° СЃ РїР»Р°С‚С„РѕСЂРјРѕР№ Рё РїСЂРѕСЃРјРѕС‚СЂР° РІ HD',
    features: [
      'Р”РѕСЃС‚СѓРї Рє РїРѕР»РЅРѕР№ С„РёР»СЊРјРѕС‚РµРєРµ РІ HD',
      '1 СѓСЃС‚СЂРѕР№СЃС‚РІРѕ РѕРґРЅРѕРІСЂРµРјРµРЅРЅРѕ',
      'РЎРєР°С‡РёРІР°РЅРёРµ РґРѕ 5 С„РёР»СЊРјРѕРІ',
      'РџРѕРґРґРµСЂР¶РєР° РІ С‡Р°С‚Рµ 24/7'
    ]
  },
  {
    id: 'standard',
    name: 'РџРѕРґРїРёСЃРєР°',
    durationMonths: 6,
    amount: 22.99,
    previousAmount: 24.99,
    pricePerMonth: 3.83,
    description: 'РћРїС‚РёРјР°Р»СЊРЅС‹Р№ С‚Р°СЂРёС„ СЃ РјР°РєСЃРёРјР°Р»СЊРЅС‹Рј СЃРѕРѕС‚РЅРѕС€РµРЅРёРµРј С†РµРЅР°/РєРѕРЅС‚РµРЅС‚',
    features: [
      'РљРёРЅРѕ + РґРѕСЂР°РјС‹ + СЌРєСЃРєР»СЋР·РёРІС‹',
      '2 СѓСЃС‚СЂРѕР№СЃС‚РІР° РѕРґРЅРѕРІСЂРµРјРµРЅРЅРѕ',
      'РЎРєР°С‡РёРІР°РЅРёРµ РґРѕ 20 С„РёР»СЊРјРѕРІ',
      'Р Р°СЃС€РёСЂРµРЅРЅС‹Р№ РїСЂРѕС„РёР»СЊ Рё РєРѕР»Р»РµРєС†РёРё',
      'РџСЂРёРѕСЂРёС‚РµС‚РЅР°СЏ РїРѕРґРґРµСЂР¶РєР°'
    ],
    isPopular: true
  },
  {
    id: 'premium',
    name: 'РџСЂРµРјРєР°',
    durationMonths: 12,
    amount: 35.19,
    pricePerMonth: 2.93,
    description: 'Р”Р»СЏ С‚РµС…, РєС‚Рѕ СЃРјРѕС‚СЂРёС‚ РєР°Р¶РґС‹Р№ РґРµРЅСЊ Рё С…РѕС‡РµС‚ РјР°РєСЃРёРјСѓРј',
    features: [
      '4Рљ + Dolby Vision/Atmos',
      '4 СѓСЃС‚СЂРѕР№СЃС‚РІР° РѕРґРЅРѕРІСЂРµРјРµРЅРЅРѕ',
      'РЎРєР°С‡РёРІР°РЅРёРµ Р±РµР· РѕРіСЂР°РЅРёС‡РµРЅРёР№',
      'РЎРµРјРµР№РЅС‹Р№ РґРѕСЃС‚СѓРї Рё РїСЂРѕС„РёР»Рё РґРµС‚РµР№',
      'РџРµСЂСЃРѕРЅР°Р»СЊРЅС‹Рµ СЂРµРєРѕРјРµРЅРґР°С†РёРё'
    ]
  }
];

const formatCurrency = (value) => `$${value.toFixed(2)}`;

function Pricing({ onNavigate }) {
  const [selectedPlanId, setSelectedPlanId] = useState(plans[1].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseState, setPurchaseState] = useState({ type: null, message: '' });

  const selectedPlan = useMemo(
    () => plans.find(plan => plan.id === selectedPlanId),
    [selectedPlanId]
  );

  const scrollToPlans = () => {
    const el = document.getElementById('pricing-plans');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePurchase = async () => {
    if (!selectedPlan || isProcessing) return;

    setIsProcessing(true);
    setPurchaseState({ type: null, message: '' });

    try {
      // РёРјРёС‚Р°С†РёСЏ РѕР±СЂР°С‰РµРЅРёСЏ Рє РїР»Р°С‚РµР¶РЅРѕРјСѓ СЃРµСЂРІРёСЃСѓ
      await new Promise(resolve => setTimeout(resolve, 1200));

      const activatedAt = new Date();
      const expiresAt = new Date(activatedAt);
      expiresAt.setMonth(expiresAt.getMonth() + selectedPlan.durationMonths);

      const historyKey = 'kinoDoraSubscriptions';
      const storedHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
      const record = {
        planId: selectedPlan.id,
        activatedAt: activatedAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        amount: selectedPlan.amount
      };

      localStorage.setItem(historyKey, JSON.stringify([...storedHistory, record]));

      setPurchaseState({
        type: 'success',
        message: `РџРѕРґРїРёСЃРєР° В«${selectedPlan.name}В» Р°РєС‚РёРІРЅР° РґРѕ ${expiresAt.toLocaleDateString('ru-RU')}`
      });
    } catch (error) {
      console.error(error);
      setPurchaseState({
        type: 'error',
        message: 'РќРµ СѓРґР°Р»РѕСЃСЊ РїСЂРѕРІРµСЃС‚Рё РѕРїР»Р°С‚Сѓ. РџРѕРїСЂРѕР±СѓР№С‚Рµ С‡СѓС‚СЊ РїРѕР·Р¶Рµ.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pricing-page">
      <Header onNavigate={onNavigate} />

      <main className="pricing-main">
        <section className="pricing-hero">
          <div className="pricing-hero-content">
            <p className="hero-label">РџРѕРґРїРёСЃРєР° Kino Dora</p>
            <h1>РћРґРёРЅ РєР»РёРє РґРѕ Р»СЋР±РёРјС‹С… РёСЃС‚РѕСЂРёР№</h1>
            <p className="hero-description">
              РџРѕРґР±РµСЂРёС‚Рµ С‚Р°СЂРёС„ РїРѕРґ СЃРІРѕР№ С‚РµРјРї РїСЂРѕСЃРјРѕС‚СЂР°: РѕС‚ РІРµС‡РµСЂРЅРёС… РїСЂРµРјСЊРµСЂ РЅР° РґРёРІР°РЅРµ
              РґРѕ СЃРµРјРµР№РЅС‹С… РјР°СЂР°С„РѕРЅРѕРІ РІ 4Рљ. Р’СЃРµ РїРѕРґРїРёСЃРєРё РјРѕР¶РЅРѕ РѕС‚РјРµРЅРёС‚СЊ РІ Р»СЋР±РѕР№ РјРѕРјРµРЅС‚.
            </p>
            <div className="pricing-hero-actions">
              <button className="primary-action" onClick={scrollToPlans}>
                Р’С‹Р±СЂР°С‚СЊ С‚Р°СЂРёС„
              </button>
              <button className="secondary-action" onClick={() => onNavigate?.('contact')}>
                РЎРІСЏР·Р°С‚СЊСЃСЏ СЃ РЅР°РјРё
              </button>
            </div>
          </div>

          <div className="hero-card">
            <div className="card-gradient"></div>
            <h3>Р”Рѕ 4 СѓСЃС‚СЂРѕР№СЃС‚РІ</h3>
            <p>РЎРјРѕС‚СЂРёС‚Рµ РЅР° С‚РµР»РµРІРёР·РѕСЂРµ, РїР»Р°РЅС€РµС‚Рµ, РєРѕРЅСЃРѕР»Рё Рё РІ РїСЂРёР»РѕР¶РµРЅРёРё</p>
            <div className="stats">
              <div>
                <span className="stat-value">4K</span>
                <span className="stat-label">РњР°РєСЃРёРјР°Р»СЊРЅРѕРµ РєР°С‡РµСЃС‚РІРѕ</span>
              </div>
              <div>
                <span className="stat-value">1200+</span>
                <span className="stat-label">Р¤РёР»СЊРјРѕРІ Рё РґРѕСЂР°Рј</span>
              </div>
              <div>
                <span className="stat-value">24/7</span>
                <span className="stat-label">Р–РёРІР°СЏ РїРѕРґРґРµСЂР¶РєР°</span>
              </div>
            </div>
          </div>
        </section>

        <section className="plans-section" id="pricing-plans">
          <div className="plans-grid">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={`plan-card ${plan.isPopular ? 'plan-popular' : ''} ${plan.id === selectedPlanId ? 'plan-selected' : ''}`}
                onClick={() => setSelectedPlanId(plan.id)}
              >
                {plan.isPopular && <span className="plan-badge">РўРѕРї РІС‹Р±РѕСЂ</span>}
                <header>
                  <p className="plan-duration">{plan.durationMonths} РјРµСЃ.</p>
                  <h3>{plan.name}</h3>
                  <p className="plan-description">{plan.description}</p>
                </header>

                <div className="plan-price">
                  {plan.previousAmount && (
                    <span className="plan-old">{formatCurrency(plan.previousAmount)}</span>
                  )}
                  <p className="plan-new">{formatCurrency(plan.amount)}</p>
                  <span className="plan-monthly">в‰€ {formatCurrency(plan.pricePerMonth)}/РјРµСЃ</span>
                </div>

                <ul className="plan-features">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <button
                  className="select-plan-btn"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedPlanId(plan.id);
                  }}
                >
                  {plan.id === selectedPlanId ? 'Р’С‹Р±СЂР°РЅ' : 'Р’С‹Р±СЂР°С‚СЊ'}
                </button>
              </article>
            ))}
          </div>

          <div className="checkout-panel">
            <div className="checkout-card">
              <p className="checkout-label">Р’С‹ РІС‹Р±СЂР°Р»Рё</p>
              <h3>{selectedPlan?.name}</h3>
              <p className="checkout-period">{selectedPlan?.durationMonths} РјРµСЃСЏС†РµРІ РїРѕРґРїРёСЃРєРё</p>

              <div className="checkout-price">
                <span>Рљ РѕРїР»Р°С‚Рµ</span>
                <strong>{selectedPlan ? formatCurrency(selectedPlan.amount) : 'вЂ”'}</strong>
              </div>

              <div className="checkout-benefits">
                <p>Р§С‚Рѕ РІС…РѕРґРёС‚:</p>
                <ul>
                  {selectedPlan?.features.slice(0, 3).map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                  <li>РћС‚РјРµРЅР° РІ 1 РєР»РёРє РІ РїСЂРѕС„РёР»Рµ</li>
                </ul>
              </div>

              <button
                className="purchase-btn"
                type="button"
                onClick={handlePurchase}
                disabled={!selectedPlan || isProcessing}
              >
                {isProcessing ? 'РџРѕРєСѓРїР°РµРјвЂ¦' : 'РћРїР»Р°С‚РёС‚СЊ РїРѕРґРїРёСЃРєСѓ'}
              </button>

              {purchaseState.message && (
                <p className={`purchase-state ${purchaseState.type}`}>
                  {purchaseState.message}
                </p>
              )}

              <button
                className="support-btn"
                type="button"
                onClick={() => onNavigate?.('contact')}
              >
                РќСѓР¶РЅР° РїРѕРјРѕС‰СЊ
              </button>
            </div>
          </div>
        </section>
      </main>

      <FAQ />
      <Footer />
    </div>
  );
}

export default Pricing;

