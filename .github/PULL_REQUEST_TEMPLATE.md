---
name: Pull Request
about: 建立一份合併請求，請詳述變更內容與動機
body:
  - type: textarea
    id: description
    attributes:
      label: 變更內容
      description: 請簡要說明本次 PR 的主要內容
      placeholder: 輸入本次變更重點
    validations:
      required: true
  - type: textarea
    id: motivation
    attributes:
      label: 動機與背景
      description: 為什麼要進行這些變更？
      placeholder: 輸入動機與背景
    validations:
      required: false
  - type: textarea
    id: test
    attributes:
      label: 測試方式
      description: 請說明如何驗證本次變更
      placeholder: 輸入測試步驟
    validations:
      required: false
