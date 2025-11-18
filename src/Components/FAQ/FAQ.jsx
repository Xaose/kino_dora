import { useState } from 'react';
import './FAQ.scss';

function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleQuestion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqData = [
    {
      question: 'Что такое KinoDors?',
      answer: 'KinoDors — это инновационная платформа, объединяющая лучшее от киносеансов и сериалов Кинопоиска и дорамного контента DoramaLand, предлагая пользователям богатую коллекцию фильмов, сериалов и дорам в одном месте.'
    },
    {
      question: 'Как мне получить помощь, в случае возникновения каких-либо проблем?',
      answer: 'Если у вас возникнут проблемы с использованием KinoDors, вы можете обратиться в службу поддержки через онлайн-чат на сайте или написать на адрес электронной почты поддержки. Также доступен раздел помощи с подробными ответами на частые вопросы.'
    },
    {
      question: 'Удобна ли KiniDors для просмотра?',
      answer: 'KinoDors специально разработан для удобного просмотра на любом устройстве: компьютер, смартфон или планшет. Интерфейс интуитивно понятен, с функцией персональных рекомендаций и удобной навигацией, что обеспечивает комфортное времяпрепровождение.'
    },
    {
      question: 'Какова стоимость подписки на  KinoDors?',
      answer: 'Стоимость подписки на KinoDors варьируется в зависимости от пакета: базовый тариф — 5$ в месяц, расширенный с дополнительными функциями — 10$. Есть также пробный период для новых пользователей.'
    }
  ];

  return (
    <section className="faq-section" id="faq-selection">
      <h2 className="faq-title">Часто задаваемые вопросы:</h2>
      
      <div className="faq-container">
        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
            <div className="faq-card" onClick={() => toggleQuestion(index)}>
              <div className="faq-question">{item.question}</div>
              <svg
                className={`faq-icon ${expandedIndex === index ? 'expanded' : ''}`}
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fillRule="evenodd" clipRule="evenodd" d="M20.8839 27.1339C20.3957 27.622 19.6043 27.622 19.1161 27.1339L6.61612 14.6339C6.12796 14.1457 6.12796 13.3543 6.61612 12.8661C7.10427 12.378 7.89573 12.378 8.38389 12.8661L20 24.4822L31.6161 12.8661C32.1043 12.378 32.8957 12.378 33.3839 12.8661C33.872 13.3543 33.872 14.1457 33.3839 14.6339L20.8839 27.1339Z" fill="#EBFAFF"/>
              </svg>
            </div>
            <div className={`faq-answer ${expandedIndex === index ? 'expanded' : ''}`}>
              <div className="faq-answer-content">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQ;
