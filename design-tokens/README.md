# Design Tokens

디자인 시스템의 기초가 되는 디자인 토큰 모음입니다.

## 구성 요소

### 색상 (colors)

- `primary`: 메인 컬러 (#007AFF)
- `background`, `text` 등 기본 UI 요소의 색상

### 타이포그래피 (typography)

- `fontSize`: xs(12px)부터 xxl(24px)까지 6단계
- `fontWeight`: light(300)부터 extraBold(800)까지 5단계
- `lineHeight`: xs(16px)부터 xxl(36px)까지 6단계

### 여백 (spacing)

단일 값으로 구성된 여백 시스템:

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 40px

### 크기 (size)

4가지 카테고리로 구분:

- `lineWidth`: 선 굵기 (0-6px)
- `borderRadius`: 모서리 둥글기 (0-20px)
- `block`: 고정 크기 블록 (0-250px)
- `relative`: 상대적 크기 (0%-100%)

## 사용 예시

```ts
const MyComponent = () => {
  return (
    <View
      style={{
        backgroundColor: colors.primary,
        padding: spacing.lg,
        gap: spacing.sm,
      }}
    >
      <Text style={{ fontSize: typography.fontSize.md }}>텍스트 예시</Text>
    </View>
  );
};
```
