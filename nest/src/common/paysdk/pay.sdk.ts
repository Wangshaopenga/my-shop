import { ConfigService } from '@nestjs/config'
import AliPaySdk from 'alipay-sdk'
const config = new ConfigService()
export const alipaySdk = new AliPaySdk({
  appId: config.get('APPID'), // appid
  gateway: 'https://openapi.alipaydev.com/gateway.do', // 支付宝沙箱测试网关
  privateKey: config.get('PRIVATEKEY'), // 应用私钥
  alipayPublicKey: config.get('ALIPAYPUBLICKEY'), // 支付宝公钥：
})
