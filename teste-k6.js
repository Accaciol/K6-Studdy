// Creator: WebInspector 537.36

import { sleep, group } from 'k6'
import http from 'k6/http'

export const options = {}

export default function main() {
  let response

  group(
    'page_2 - https://meusite.com/?afd=1&query=Cria%C3%A7%C3%A3o+Site+Simples&afdToken=ChMI2pjRm4L1jwMVVAm5Bh0Y8y0YEnwBlLqpjwpKRfOHqWO5mOjH0a4rAq4SvToc5TXYxUyhjJFSYUJ1r-7Lf3_fUKtc9PDgw41trr2IU8nzroaxpVjDuJSbbjb9uEYWWLEDHqyI7NQ7vp1xP1ymR725ECNBjo_uKxPZ-4tVXx1lZGBX98M1LXMTxGAuNwbKJjY5IAEyNAGxUlSqL9XRLti3kq77auUY777z6ZN9SW068cdS8VQ1jtnV8btuHZR24g4U3SRZ0pcBO_M&pcsa=false&nb=0&nm=23&nx=336&ny=70&is=700x432&clkt=96&ch=1',
    function () {
      response = http.get(
        'https://meusite.com/?afd=1&query=Cria%C3%A7%C3%A3o+Site+Simples&afdToken=ChMI2pjRm4L1jwMVVAm5Bh0Y8y0YEnwBlLqpjwpKRfOHqWO5mOjH0a4rAq4SvToc5TXYxUyhjJFSYUJ1r-7Lf3_fUKtc9PDgw41trr2IU8nzroaxpVjDuJSbbjb9uEYWWLEDHqyI7NQ7vp1xP1ymR725ECNBjo_uKxPZ-4tVXx1lZGBX98M1LXMTxGAuNwbKJjY5IAEyNAGxUlSqL9XRLti3kq77auUY777z6ZN9SW068cdS8VQ1jtnV8btuHZR24g4U3SRZ0pcBO_M&pcsa=false&nb=0&nm=23&nx=336&ny=70&is=700x432&clkt=96&ch=1&query=Cria%25C3%25A7%25C3%25A3o%2BSite%2BSimples',
        {
          headers: {
            accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            priority: 'u=0, i',
            referer: 'https://syndicatedsearch.goog/',
            'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'cross-site',
            'upgrade-insecure-requests': '1',
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0',
          },
        }
      )

      response = http.get('https://meusite.com/_static/doais8fj34js.js?nonce=3573', {
        headers: {
          'sec-ch-ua-platform': '"Windows"',
          Referer:
            'https://meusite.com/?afd=1&query=Cria%C3%A7%C3%A3o+Site+Simples&afdToken=ChMI2pjRm4L1jwMVVAm5Bh0Y8y0YEnwBlLqpjwpKRfOHqWO5mOjH0a4rAq4SvToc5TXYxUyhjJFSYUJ1r-7Lf3_fUKtc9PDgw41trr2IU8nzroaxpVjDuJSbbjb9uEYWWLEDHqyI7NQ7vp1xP1ymR725ECNBjo_uKxPZ-4tVXx1lZGBX98M1LXMTxGAuNwbKJjY5IAEyNAGxUlSqL9XRLti3kq77auUY777z6ZN9SW068cdS8VQ1jtnV8btuHZR24g4U3SRZ0pcBO_M&pcsa=false&nb=0&nm=23&nx=336&ny=70&is=700x432&clkt=96&ch=1',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0',
          'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
          'sec-ch-ua-mobile': '?0',
        },
      })

      response = http.post(
        'https://meusite.com/_d',
        '{"referrer":"https://syndicatedsearch.goog/","current_location":"https://meusite.com/?afd=1&query=Cria%C3%A7%C3%A3o+Site+Simples&afdToken=ChMI2pjRm4L1jwMVVAm5Bh0Y8y0YEnwBlLqpjwpKRfOHqWO5mOjH0a4rAq4SvToc5TXYxUyhjJFSYUJ1r-7Lf3_fUKtc9PDgw41trr2IU8nzroaxpVjDuJSbbjb9uEYWWLEDHqyI7NQ7vp1xP1ymR725ECNBjo_uKxPZ-4tVXx1lZGBX98M1LXMTxGAuNwbKJjY5IAEyNAGxUlSqL9XRLti3kq77auUY777z6ZN9SW068cdS8VQ1jtnV8btuHZR24g4U3SRZ0pcBO_M&pcsa=false&nb=0&nm=23&nx=336&ny=70&is=700x432&clkt=96&ch=1","redirect_count":0,"user_agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0","window_info":{"href":"https://meusite.com/?afd=1&query=Cria%C3%A7%C3%A3o+Site+Simples&afdToken=ChMI2pjRm4L1jwMVVAm5Bh0Y8y0YEnwBlLqpjwpKRfOHqWO5mOjH0a4rAq4SvToc5TXYxUyhjJFSYUJ1r-7Lf3_fUKtc9PDgw41trr2IU8nzroaxpVjDuJSbbjb9uEYWWLEDHqyI7NQ7vp1xP1ymR725ECNBjo_uKxPZ-4tVXx1lZGBX98M1LXMTxGAuNwbKJjY5IAEyNAGxUlSqL9XRLti3kq77auUY777z6ZN9SW068cdS8VQ1jtnV8btuHZR24g4U3SRZ0pcBO_M&pcsa=false&nb=0&nm=23&nx=336&ny=70&is=700x432&clkt=96&ch=1","hostname":"meusite.com","pathname":"/"}}',
        {
          headers: {
            accept: '*/*',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            'content-type': 'application/json',
            origin: 'https://meusite.com',
            priority: 'u=1, i',
            referer:
              'https://meusite.com/?afd=1&query=Cria%C3%A7%C3%A3o+Site+Simples&afdToken=ChMI2pjRm4L1jwMVVAm5Bh0Y8y0YEnwBlLqpjwpKRfOHqWO5mOjH0a4rAq4SvToc5TXYxUyhjJFSYUJ1r-7Lf3_fUKtc9PDgw41trr2IU8nzroaxpVjDuJSbbjb9uEYWWLEDHqyI7NQ7vp1xP1ymR725ECNBjo_uKxPZ-4tVXx1lZGBX98M1LXMTxGAuNwbKJjY5IAEyNAGxUlSqL9XRLti3kq77auUY777z6ZN9SW068cdS8VQ1jtnV8btuHZR24g4U3SRZ0pcBO_M&pcsa=false&nb=0&nm=23&nx=336&ny=70&is=700x432&clkt=96&ch=1',
            'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0',
          },
        }
      )

      response = http.get('https://www.google.com/adsense/domains/caf.js?abp=1&abpgo=true', {
        headers: {
          'sec-ch-ua-platform': '"Windows"',
          Referer: 'https://meusite.com/',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0',
          'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
          'sec-ch-ua-mobile': '?0',
        },
      })

      response = http.get(
        'https://partner.googleadservices.com/gampad/cookie.js?domain=meusite.com&client=partner-dp-giantpanda-st_3ph&product=SAS&callback=__sasCookie&cookie_types=v1%2Cv2',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            Referer: 'https://meusite.com/',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0',
            'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
            'sec-ch-ua-mobile': '?0',
          },
        }
      )

      response = http.get('https://syndicatedsearch.goog/afs/ads/i/iframe.html', {
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
          priority: 'u=0, i',
          referer: 'https://meusite.com/',
          'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'iframe',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'cross-site',
          'sec-fetch-storage-access': 'active',
          'upgrade-insecure-requests': '1',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0',
        },
      })

      response = http.get('https://syndicatedsearch.goog/afs/ads/i/iframe.html', {
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
          'if-modified-since': 'Tue, 17 Sep 2024 06:00:00 GMT',
          priority: 'u=0, i',
          referer: 'https://meusite.com/',
          'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'iframe',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'cross-site',
          'sec-fetch-storage-access': 'active',
          'upgrade-insecure-requests': '1',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0',
        },
      })

      response = http.get(
        'https://syndicatedsearch.goog/afs/ads?adsafe=low&adtest=off&psid=9632785057&pcsa=false&channel=ch1&domain_name=meusite.com&client=dp-giantpanda-st_3ph&r=m&hl=en&ivt=1&rpbu=https%3A%2F%2Fmeusite.com%2F%3Fafd%3D1%26query%3DCria%25C3%25A7%25C3%25A3o%2BSite%2BSimples%26afdToken%3DChMI2pjRm4L1jwMVVAm5Bh0Y8y0YEnwBlLqpjwpKRfOHqWO5mOjH0a4rAq4SvToc5TXYxUyhjJFSYUJ1r-7Lf3_fUKtc9PDgw41trr2IU8nzroaxpVjDuJSbbjb9uEYWWLEDHqyI7NQ7vp1xP1ymR725ECNBjo_uKxPZ-4tVXx1lZGBX98M1LXMTxGAuNwbKJjY5IAEyNAGxUlSqL9XRLti3kq77auUY777z6ZN9SW068cdS8VQ1jtnV8btuHZR24g4U3SRZ0pcBO_M%26pcsa%3Dfalse%26nb%3D0%26nm%3D23%26nx%3D336%26ny%3D70%26is%3D700x432%26clkt%3D96%26ch%3D1%26afd%3D1&terms=Site%20Profissional%2CCria%C3%A7%C3%A3o%20Site%20Simples%2CE-commerce%20F%C3%A1cil&kw=Site%20Profissional%2CCria%C3%A7%C3%A3o%20Site%20Simples%2CE-commerce%20F%C3%A1cil&type=0&swp=as-drid-2294179469204103&q=Cria%C3%A7%C3%A3o%20Site%20Simples&afdt=ChMI2pjRm4L1jwMVVAm5Bh0Y8y0YEnwBlLqpjwpKRfOHqWO5mOjH0a4rAq4SvToc5TXYxUyhjJFSYUJ1r-7Lf3_fUKtc9PDgw41trr2IU8nzroaxpVjDuJSbbjb9uEYWWLEDHqyI7NQ7vp1xP1ymR725ECNBjo_uKxPZ-4tVXx1lZGBX98M1LXMTxGAuNwbKJjY5IAEyNAGxUlSqL9XRLti3kq77auUY777z6ZN9SW068cdS8VQ1jtnV8btuHZR24g4U3SRZ0pcBO_M&oe=UTF-8&ie=UTF-8&fexp=21404%2C17300003%2C17301437%2C17301439%2C17301442%2C17301548%2C17301266%2C72717108&format=n3&ad=n3&nocache=2391758841255811&num=0&output=afd_ads&v=3&bsl=8&pac=0&u_his=2&u_tz=-180&dt=1758841255812&u_w=2560&u_h=1080&biw=1223&bih=566&psw=1223&psh=566&frm=0&uio=-wi500&cont=ads&drt=0&jsid=caf&nfp=1&jsv=810396895&rurl=https%3A%2F%2Fmeusite.com%2F%3Fafd%3D1%26query%3DCria%25C3%25A7%25C3%25A3o%2BSite%2BSimples%26afdToken%3DChMI2pjRm4L1jwMVVAm5Bh0Y8y0YEnwBlLqpjwpKRfOHqWO5mOjH0a4rAq4SvToc5TXYxUyhjJFSYUJ1r-7Lf3_fUKtc9PDgw41trr2IU8nzroaxpVjDuJSbbjb9uEYWWLEDHqyI7NQ7vp1xP1ymR725ECNBjo_uKxPZ-4tVXx1lZGBX98M1LXMTxGAuNwbKJjY5IAEyNAGxUlSqL9XRLti3kq77auUY777z6ZN9SW068cdS8VQ1jtnV8btuHZR24g4U3SRZ0pcBO_M%26pcsa%3Dfalse%26nb%3D0%26nm%3D23%26nx%3D336%26ny%3D70%26is%3D700x432%26clkt%3D96%26ch%3D1&referer=https%3A%2F%2Fsyndicatedsearch.goog%2F',
        {
          headers: {
            accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            priority: 'u=0, i',
            referer: 'https://meusite.com/',
            'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'iframe',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-storage-access': 'active',
            'upgrade-insecure-requests': '1',
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0',
          },
        }
      )

      response = http.post(
        'https://meusite.com/_e',
        '{"event":"event:browser:caf:page:loaded","event_data":{"context":{"status":{"client":"partner-dp-giantpanda-st_3ph","query":"Criação Site Simples","adult":false},"client":"partner-dp-giantpanda-st_3ph","query":"Criação Site Simples"},"domain_settings":{"domain_id":"954740345249643","user_uuid4":"4cd64db9-4e2a-4fbc-a46b-e463e0dcd5f0","sets":[{"delivery":{"can_tier1":true,"tier1":{"drid":"as-drid-2294179469204103"}}}]}}}',
        {
          headers: {
            accept: '*/*',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            'content-type': 'application/json',
            origin: 'https://meusite.com',
            priority: 'u=1, i',
            referer:
              'https://meusite.com/?afd=1&query=Cria%C3%A7%C3%A3o+Site+Simples&afdToken=ChMI2pjRm4L1jwMVVAm5Bh0Y8y0YEnwBlLqpjwpKRfOHqWO5mOjH0a4rAq4SvToc5TXYxUyhjJFSYUJ1r-7Lf3_fUKtc9PDgw41trr2IU8nzroaxpVjDuJSbbjb9uEYWWLEDHqyI7NQ7vp1xP1ymR725ECNBjo_uKxPZ-4tVXx1lZGBX98M1LXMTxGAuNwbKJjY5IAEyNAGxUlSqL9XRLti3kq77auUY777z6ZN9SW068cdS8VQ1jtnV8btuHZR24g4U3SRZ0pcBO_M&pcsa=false&nb=0&nm=23&nx=336&ny=70&is=700x432&clkt=96&ch=1',
            'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0',
          },
        }
      )

      response = http.post(
        'https://meusite.com/_e',
        '{"event":"event:browser:caf:block:loaded","event_data":{"context":{"container":"ads","terms":"Site Profissional,Criação Site Simples,E-commerce Fácil","callbackOptions":{"cafRequestAccepted":true,"cafStatus":{"client":"partner-dp-giantpanda-st_3ph","query":"Criação Site Simples","adult":false}}},"domain_settings":{"domain_id":"954740345249643","user_uuid4":"4cd64db9-4e2a-4fbc-a46b-e463e0dcd5f0","sets":[{"delivery":{"can_tier1":true,"tier1":{"drid":"as-drid-2294179469204103"}}}]}}}',
        {
          headers: {
            accept: '*/*',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            'content-type': 'application/json',
            origin: 'https://meusite.com',
            priority: 'u=1, i',
            referer:
              'https://meusite.com/?afd=1&query=Cria%C3%A7%C3%A3o+Site+Simples&afdToken=ChMI2pjRm4L1jwMVVAm5Bh0Y8y0YEnwBlLqpjwpKRfOHqWO5mOjH0a4rAq4SvToc5TXYxUyhjJFSYUJ1r-7Lf3_fUKtc9PDgw41trr2IU8nzroaxpVjDuJSbbjb9uEYWWLEDHqyI7NQ7vp1xP1ymR725ECNBjo_uKxPZ-4tVXx1lZGBX98M1LXMTxGAuNwbKJjY5IAEyNAGxUlSqL9XRLti3kq77auUY777z6ZN9SW068cdS8VQ1jtnV8btuHZR24g4U3SRZ0pcBO_M&pcsa=false&nb=0&nm=23&nx=336&ny=70&is=700x432&clkt=96&ch=1',
            'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0',
          },
        }
      )

      response = http.get(
        'https://syndicatedsearch.goog/afs/gen_204?client=dp-giantpanda-st_3ph&output=uds_ads_only&zx=4zc50psj2s2a&cd_fexp=72717108&aqid=p8nVaJfqDPO_obIPlOCBiQQ&psid=9632785057&pbt=bs&adbx=354&adby=121&adbh=1042&adbw=500&adbah=370%2C268%2C378&adbn=master-1&eawp=partner-dp-giantpanda-st_3ph&errv=810396895&csala=17%7C0%7C421%7C3%7C30&lle=0&ifv=1&hpt=1',
        {
          headers: {
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            priority: 'i',
            referer: 'https://meusite.com/',
            'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'image',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-storage-access': 'active',
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0',
          },
        }
      )

      response = http.get(
        'https://syndicatedsearch.goog/afs/gen_204?client=dp-giantpanda-st_3ph&output=uds_ads_only&zx=mqt7lg8pna3v&cd_fexp=72717108&aqid=p8nVaJfqDPO_obIPlOCBiQQ&psid=9632785057&pbt=bv&adbx=354&adby=121&adbh=1042&adbw=500&adbah=370%2C268%2C378&adbn=master-1&eawp=partner-dp-giantpanda-st_3ph&errv=810396895&csala=17%7C0%7C421%7C3%7C30&lle=0&ifv=1&hpt=1',
        {
          headers: {
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            priority: 'i',
            referer: 'https://meusite.com/',
            'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'image',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-storage-access': 'active',
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0',
          },
        }
      )
    }
  )

  response = http.get('https://syndicatedsearch.goog/adsense/domains/caf.js', {
    headers: {
      'sec-ch-ua-platform': '"Windows"',
      Referer: 'https://syndicatedsearch.goog/',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0',
      'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
      'sec-ch-ua-mobile': '?0',
    },
  })

  response = http.get(
    'https://tpc.googlesyndication.com/simgad/17146140888415138540?sqp=-oaymwEKCCgQKCABUAFYAQ&rs=AOga4ql-KXz7MO8Qs-pPmYdFwTMLvphjYg',
    {
      headers: {
        'sec-ch-ua-platform': '"Windows"',
        Referer: 'https://syndicatedsearch.goog/',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0',
        'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
        'sec-ch-ua-mobile': '?0',
      },
    }
  )

  response = http.get('https://www.google.com/images/afs/snowman.png', {
    headers: {
      accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
      priority: 'u=1, i',
      referer: 'https://syndicatedsearch.goog/',
      'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'image',
      'sec-fetch-mode': 'no-cors',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-storage-access': 'active',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0',
    },
  })

  response = http.get('https://afs.googleusercontent.com/svg/arrow_forward.svg?c=%23ffffff', {
    headers: {
      accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
      priority: 'i',
      referer: 'https://syndicatedsearch.goog/',
      'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'image',
      'sec-fetch-mode': 'no-cors',
      'sec-fetch-site': 'cross-site',
      'sec-fetch-storage-access': 'active',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0',
    },
  })

  // Automatically added sleep
  sleep(1)
}
