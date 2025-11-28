// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapAreaResponse(response: any) { // TODO do not use any
    return response.labels.map((label: string, index: number) => ({
        name: label,
        value: response.dataPoints[index]
    }));
}
