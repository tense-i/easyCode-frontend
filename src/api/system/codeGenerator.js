import request from '@/utils/request'



/**
 * <p>预览代码</p>
 * <p>需要传入 配置ID 和 GenTables</p>
 */
export function previewCodeByGenConfigAndGenTables(data) {
    return request({
        url: '/dbdog/generator/previewCodeByGenConfigAndGenTables',
        method: 'post',
        data: data
    })
}

/**
 * <p>下载代码</p>
 * <p>需要传入 配置ID 和 GenTables</p>
 */
export function downloadCodeByGenConfigAndGenTables(data) {
    return request({
        url: '/dbdog/generator/downloadCodeByGenConfigAndGenTables',
        method: 'post',
        data: data
    })
}
