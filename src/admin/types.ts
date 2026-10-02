/** صورة داخل نموذج المنتج: إما محفوظة مسبقًا، أو جديدة لم تُرفع بعد. */
export type ImageItem =
  | { key: string; kind: 'existing'; url: string }
  | {
      key: string;
      kind: 'new';
      /** الصورة بعد الضغط، جاهزة للرفع. */
      blob: Blob;
      /** رابط blob: مؤقت للمعاينة — يُلغى عند الإزالة. */
      preview: string;
    };
