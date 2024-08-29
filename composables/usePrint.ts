import { useCvState } from '~/data/useCvState'
import { saveAs } from 'file-saver'
import * as docx from 'docx'
export default function usePrint() {
  const { formSettings } = useCvState()
  const i18n = useI18n()
  const docTitle = ref<string>()

  onMounted(() => {
    const printMargin = cssPagedMedia('margin')
    docTitle.value = document.title

    addEventListener('beforeprint', () => {
      formSettings.value.layout === 'one-column' ? printMargin('0.45in') : printMargin('0in')
    })

    addEventListener('afterprint', () => {
      if (typeof docTitle.value === 'string')
        document.title = docTitle.value
    })

    addEventListener('keydown', (e) => {
      if (e.metaKey && e.key === 'p') {
        e.preventDefault()
        downloadPdf()
      }
    })
  })

  function cssPagedMedia(property: string) {
    const style = document.createElement('style')
    document.head.appendChild(style)
    return function (value: string) {
      style.innerHTML = `@page {${property}: ${value}}`
    }
  }

  function downloadPdf(): void {
    changeDocTitle()
    window.print()
  }

  function changeDocTitle() {
    document.title = `CV_${formSettings.value.name}_${formSettings.value.lastName}_${i18n.locale.value}`
  }

  function downloadWord(): void {
    const doc = new docx.Document({
      sections: [{
        properties: {},
        children: [
          new docx.Paragraph({
            children: [
              new docx.TextRun(`${formSettings.value.name} ${formSettings.value.lastName}`),
            ],
          }),
          // Add more paragraphs and sections based on your CV structure
        ],
      }],
    })

    docx.Packer.toBlob(doc).then(blob => {
      saveAs(blob, `CV_${formSettings.value.name}_${formSettings.value.lastName}_${i18n.locale.value}.docx`)
    })
  }


  return {
    downloadPdf,
    downloadWord,
  }
}
