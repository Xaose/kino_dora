import { useMemo, useState } from 'react';
import './Pricing.scss';
import FAQ from '../../Components/FAQ/FAQ';
import Footer from '../../Components/Footer/Footer';

const plans = [
  {
    id: 'basic',
    name: 'База',
    durationMonths: 3,
    amount: 15.14,
    pricePerMonth: 5.05,
    description: 'Для знакомства с платформой и просмотра в HD',
    features: [
      'Доступ к полной фильмотеке в HD',
      '1 устройство одновременно',
      'Скачивание до 5 фильмов',
      'Поддержка в чате 24/7'
    ]
  },
  {
    id: 'standard',
    name: 'Подписка',
    durationMonths: 6,
    amount: 22.99,
    previousAmount: 24.99,
    pricePerMonth: 3.83,
    description: 'Оптимальный тариф с максимальным соотношением цена/контент',
    features: [
      'Кино + дорамы + эксклюзивы',
      '2 устройства одновременно',
      'Скачивание до 20 фильмов',
      'Расширенный профиль и коллекции',
      'Приоритетная поддержка'
    ],
    isPopular: true
  },
  {
    id: 'premium',
    name: 'Премка',
    durationMonths: 12,
    amount: 35.19,
    pricePerMonth: 2.93,
    description: 'Для тех, кто смотрит каждый день и хочет максимум',
    features: [
      '4K + Dolby Vision/Atmos',
      '4 устройства одновременно',
      'Скачивание без ограничений',
      'Семейный доступ и профили детей',
      'Персональные рекомендации'
    ]
  }
];

const valueProps = [
  {
    id: 'quality',
    icon: '✨',
    title: 'Премиальное качество',
    description: '4K + HDR, Dolby Vision & Atmos и адаптивный битрейт под любое устройство.'
  },
  {
    id: 'library',
    icon: '🎞️',
    title: 'Живая библиотека',
    description: 'Новинки каждую неделю, авторские подборки и эксклюзивы, которых нет на других сервисах.'
  },
  {
    id: 'privacy',
    icon: '🔐',
    title: 'Честный доступ',
    description: 'Без рекламы, без скрытых платежей и с возможностью отмены подписки в один клик.'
  }
];

const assurancePoints = [
  '7-дневный триал на любой тариф',
  'Прозрачная история платежей в профиле',
  'Скидка -15% при оплате карты резидента СНГ',
  'Поддержка отвечает в среднем за 2 минуты'
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
      // имитация обращения к платежному сервису
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
        message: `Подписка «${selectedPlan.name}» активна до ${expiresAt.toLocaleDateString('ru-RU')}`
      });
    } catch (error) {
      console.error(error);
      setPurchaseState({
        type: 'error',
        message: 'Не удалось провести оплату. Попробуйте чуть позже.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pricing-page">
      <main className="pricing-main">
        <section className="pricing-hero">
          <div className="pricing-hero-content">
            <div className="hero-pill">Новинки каждую неделю</div>
            <p className="hero-label">Подписка Kino Dora</p>
            <h1>Один клик до любимых историй</h1>
            <p className="hero-description">
              Подберите тариф под свой темп просмотра: от вечерних премьер на диване
              до семейных марафонов в 4K. Все подписки можно отменить в любой момент.
            </p>
            <ul className="hero-highlights">
              <li>7 дней бесплатно + отмена без звонков</li>
              <li>Персональные рекомендации и коллекции</li>
              <li>Синхронизация прогресса между устройствами</li>
            </ul>
            <div className="pricing-hero-actions">
              <button className="primary-action" onClick={scrollToPlans}>
                Выбрать тариф
              </button>
              <button className="secondary-action" onClick={() => onNavigate?.('contact')}>
                Связаться с нами
              </button>
            </div>
          </div>

          <div className="hero-card">
            <div className="card-gradient"></div>
            <h3>До 4 устройств</h3>
            <p>Смотрите на телевизоре, планшете, консоли и в приложении</p>
            <div className="stats">
              <div>
                <span className="stat-value">4K</span>
                <span className="stat-label">Максимальное качество</span>
              </div>
              <div>
                <span className="stat-value">1200+</span>
                <span className="stat-label">Фильмов и дорам</span>
              </div>
              <div>
                <span className="stat-value">24/7</span>
                <span className="stat-label">Живая поддержка</span>
              </div>
            </div>
          </div>
        </section>

        <section className="value-props-section">
          <div className="section-heading">
            <p>Почему выбирают нас</p>
            <h2>Контент и сервис без компромиссов</h2>
          </div>
          <div className="value-props-grid">
            {valueProps.map((prop) => (
              <article key={prop.id} className="value-prop-card">
                <span className="value-prop-icon" aria-hidden="true">
                  {prop.icon}
                </span>
                <h3>{prop.title}</h3>
                <p>{prop.description}</p>
              </article>
            ))}
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
                {plan.isPopular && <span className="plan-badge">Топ выбор</span>}
                <header>
                  <p className="plan-duration">{plan.durationMonths} мес.</p>
                  <h3 className='plan-name'>{plan.name}</h3>
                  <p className="plan-description">{plan.description}</p>
                </header>

                <div className="plan-price">
                  {plan.previousAmount && (
                    <span className="plan-old">{formatCurrency(plan.previousAmount)}</span>
                  )}
                  <p className="plan-new">{formatCurrency(plan.amount)}</p>
                  <span className="plan-monthly">≈ {formatCurrency(plan.pricePerMonth)}/мес</span>
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
                  {plan.id === selectedPlanId ? 'Выбран' : 'Выбрать'}
                </button>
              </article>
            ))}
          </div>

          <div className="checkout-panel">
            <div className="checkout-card">
              <p className="checkout-label">Вы выбрали</p>
              <h3 className='checkout-name'>{selectedPlan?.name}</h3>
              <p className="checkout-period">{selectedPlan?.durationMonths} месяцев подписки</p>

              <div className="checkout-price">
                <span className='checkout-price-label'>К оплате</span>
                <strong className='checkout-price-value'>{selectedPlan ? formatCurrency(selectedPlan.amount) : '—'}</strong>
              </div>

              <div className="checkout-benefits">
                <p className='checkout-benefits-label'>Что входит:</p>
                <ul>
                  {selectedPlan?.features.slice(0, 3).map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                  <li>Отмена в 1 клик в профиле</li>
                </ul>
              </div>

              <button
                className="purchase-btn"
                type="button"
                onClick={handlePurchase}
                disabled={!selectedPlan || isProcessing}
              >
                {isProcessing ? 'Покупаем…' : 'Оплатить подписку'}
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
                Нужна помощь
              </button>
            </div>
          </div>
        </section>

        <section className="assurance-section">
          <div className="assurance-card">
            <p className="assurance-label">Забота о зрителях</p>
            <h2>Удобная оплата и гарантия возврата</h2>
            <p className="assurance-text">
              Если сервис не подошёл — вернём деньги в течение 14 дней, а оставшийся доступ
              останется до конца оплаченного периода. Управляйте подпиской прямо в профиле.
            </p>
          </div>
          <ul className="assurance-list">
            {assurancePoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      </main>

      <FAQ />
      <Footer />
    </div>
  );
}

export default Pricing;

