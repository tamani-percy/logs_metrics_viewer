export const formatLocalDateTime = (dateTimeString: string): string => {
    const date = new Date(dateTimeString)

    return date.toLocaleString('en-US', {
        month: 'short',   // Mar
        day: '2-digit',   // 23
        year: '2-digit',  // 26
        hour: '2-digit',  // 12
        minute: '2-digit',// 30
        hour12: false     // 24-hour format
    })
}

export const formatLocalDate = (date: Date): string => {
    return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0')
}