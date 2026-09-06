import { Seo } from '@/components/Seo';
import { storeConfig } from '@/config/store';

interface Section {
  heading: string;
  paragraphs: string[];
}

const PRIVACY: Section[] = [
  {
    heading: 'مقدمة',
    paragraphs: [
      `يوضّح هذا النص كيف يتعامل متجر ${storeConfig.name} مع بياناتك عند استخدام الموقع.`,
      'موقعنا موقع عرض منتجات فقط، ولا يحتوي على تسجيل حسابات ولا بوابة دفع إلكتروني.',
    ],
  },
  {
    heading: 'ما البيانات التي نجمعها؟',
    paragraphs: [
      'الموقع لا يجمع بياناتك الشخصية ولا يرسلها إلى أي خادم. سلة التسوق والمفضلة تُحفظان داخل متصفحك وحده (localStorage) ولا يطّلع عليهما أحد سواك.',
      'يمكنك حذفهما في أي وقت بإفراغ السلة والمفضلة أو بمسح بيانات الموقع من إعدادات المتصفح.',
    ],
  },
  {
    heading: 'البيانات التي ترسلينها عبر واتساب',
    paragraphs: [
      'عند الضغط على أزرار الطلب، يُفتح تطبيق واتساب برسالة جاهزة. أنتِ من يقرّر إرسالها.',
      'ما ترسلينه عبر واتساب يخضع لسياسة خصوصية واتساب، ونستخدمه فقط لتنفيذ طلبك والتواصل معك بشأنه.',
    ],
  },
  {
    heading: 'مشاركة البيانات',
    paragraphs: [
      'لا نبيع بياناتك ولا نشاركها مع أطراف ثالثة لأغراض تسويقية.',
      'قد نشارك عنوان التوصيل مع شركة الشحن عند الحاجة لتسليم طلبك فقط.',
    ],
  },
  {
    heading: 'التواصل',
    paragraphs: [
      `لأي استفسار بخصوص الخصوصية، تواصلي معنا عبر واتساب أو على البريد ${storeConfig.email}.`,
    ],
  },
];

const TERMS: Section[] = [
  {
    heading: 'قبول الشروط',
    paragraphs: [
      `باستخدامك موقع ${storeConfig.name} فإنك توافقين على الشروط الموضّحة في هذه الصفحة.`,
    ],
  },
  {
    heading: 'المنتجات والأسعار',
    paragraphs: [
      `جميع الأسعار المعروضة بالأوقية الموريتانية الجديدة (${storeConfig.currency}) وتشمل قيمة المنتج فقط دون رسوم التوصيل.`,
      'نحرص على دقة الصور والأوصاف، وقد يختلف اللون قليلًا حسب إضاءة الشاشة.',
      'الأسعار والتوفّر قابلان للتغيير، ويُعتمد ما يتم تأكيده معك عبر واتساب.',
    ],
  },
  {
    heading: 'الطلب والتأكيد',
    paragraphs: [
      'لا يُعد الطلب مؤكدًا بمجرد إضافته إلى السلة. يُعتمد الطلب بعد إرساله عبر واتساب وتأكيده من فريقنا.',
      'نتواصل معك لتأكيد التوفّر وتفاصيل التوصيل وطريقة الدفع قبل التنفيذ.',
    ],
  },
  {
    heading: 'خدمة الشراء من الخارج',
    paragraphs: [
      'السعر الظاهر في الموقع الخارجي ليس السعر النهائي. نراجع طلبك ونحسب التكلفة شاملة الشحن والرسوم ونرسلها إليك للموافقة قبل الشراء.',
      'مدة الوصول تقديرية وتعتمد على الموقع الخارجي وشركة الشحن.',
    ],
  },
  {
    heading: 'التوصيل',
    paragraphs: [
      'نوصل داخل موريتانيا. تُحدَّد رسوم التوصيل حسب المنطقة وتُبلَّغين بها عند تأكيد الطلب.',
    ],
  },
  {
    heading: 'الاستبدال والإرجاع',
    paragraphs: [
      'لأسباب صحية، لا تُستبدل العطور ومستحضرات التجميل ومنتجات العناية بعد فتح العبوة.',
      'إذا وصل المنتج تالفًا أو مختلفًا عمّا طلبتِه، تواصلي معنا خلال 48 ساعة من الاستلام وسنعالج الأمر.',
    ],
  },
  {
    heading: 'الاستخدام',
    paragraphs: [
      'محتوى الموقع من نصوص وصور مملوك للمتجر، ولا يجوز إعادة استخدامه تجاريًا دون إذن.',
    ],
  },
];

interface LegalPageProps {
  kind: 'privacy' | 'terms';
}

export default function LegalPage({ kind }: LegalPageProps) {
  const isPrivacy = kind === 'privacy';
  const title = isPrivacy ? 'سياسة الخصوصية' : 'الشروط والأحكام';
  const sections = isPrivacy ? PRIVACY : TERMS;

  return (
    <>
      <Seo title={title} description={`${title} لمتجر ${storeConfig.name}.`} />

      <div className="surface-blush border-b border-mauve-100">
        <div className="container-page py-12 text-center sm:py-14">
          <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-ink-soft">
            آخر تحديث: <span className="num">2026</span>
          </p>
        </div>
      </div>

      <div className="container-page py-10">
        <article className="mx-auto max-w-3xl space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-semibold text-ink">{section.heading}</h2>
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-[15px] leading-8 text-ink-soft">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
