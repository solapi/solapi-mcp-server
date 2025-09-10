import type {Example} from "../types";

/**
 * SOLAPI Java/Kotlin SDK 예제 코드 라이브러리
 * @description Java/Kotlin용 실제 사용 가능한 코드 스니펫들을 내장하여 빠른 검색 제공
 */
export class JavaExamplesLibrary {
  /**
   * 모든 예제 코드 반환
   * @returns 예제 코드 배열
   */
  static getExamples(): Example[] {
    return [
      {
        id: 'java-client-setup',
        title: 'Java 클라이언트 초기 설정',
        description: 'SOLAPI Java SDK를 사용하기 위한 기본 설정 및 클라이언트 초기화 예제입니다.',
        category: '초기설정',
        keywords: ['java', 'kotlin', '초기화', '설정', '클라이언트', 'api', 'key', 'secret'],
        code: `import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.service.DefaultMessageService;

public class SolapiExample {
    public static void main(String[] args) {
        // API 키와 시크릿 키 설정
        String apiKey = "YOUR_API_KEY";
        String apiSecretKey = "YOUR_API_SECRET";
        
        // SolapiClient를 사용한 클라이언트 생성 (권장)
        DefaultMessageService messageService = SolapiClient.createInstance(apiKey, apiSecretKey);
        
        // 또는 정적 IP 사용 시
        DefaultMessageService messageServiceWithStaticIP = SolapiClient.createInstance(apiKey, apiSecretKey, true);
        
        System.out.println("SOLAPI 클라이언트가 성공적으로 초기화되었습니다.");
    }
}`,
        usage: 'Java 프로젝트에서 SOLAPI를 처음 사용할 때',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'kotlin-client-setup',
        title: 'Kotlin 클라이언트 초기 설정',
        description: 'SOLAPI Kotlin SDK를 사용하기 위한 기본 설정 및 클라이언트 초기화 예제입니다.',
        category: '초기설정',
        keywords: ['kotlin', 'java', '초기화', '설정', '클라이언트', 'api', 'key', 'secret'],
        code: `import com.solapi.sdk.SolapiClient
import com.solapi.sdk.message.service.DefaultMessageService

fun main() {
    // API 키와 시크릿 키 설정
    val apiKey = "YOUR_API_KEY"
    val apiSecretKey = "YOUR_API_SECRET"
    
    // SolapiClient를 사용한 클라이언트 생성 (권장)
    val messageService = SolapiClient.createInstance(apiKey, apiSecretKey)
    
    // 또는 정적 IP 사용 시
    val messageServiceWithStaticIP = SolapiClient.createInstance(apiKey, apiSecretKey, true)
    
    println("SOLAPI 클라이언트가 성공적으로 초기화되었습니다.")
}`,
        usage: 'Kotlin 프로젝트에서 SOLAPI를 처음 사용할 때',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'java-environment-setup',
        title: 'Java 환경 변수 설정',
        description: 'Java에서 환경 변수를 사용하여 API 키를 안전하게 관리하는 예제입니다.',
        category: '초기설정',
        keywords: ['java', '환경변수', 'environment', 'api', 'key', 'secret', '보안', '설정'],
        code: `import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.service.DefaultMessageService;

public class EnvironmentSetupExample {
    public static void main(String[] args) {
        try {
            // 환경 변수에서 API 키 읽기
            String apiKey = System.getenv("SOLAPI_API_KEY");
            String apiSecretKey = System.getenv("SOLAPI_API_SECRET");
            
            // 환경 변수가 설정되지 않은 경우 기본값 사용
            if (apiKey == null || apiKey.isEmpty()) {
                apiKey = "YOUR_API_KEY"; // 실제 운영에서는 환경 변수 사용 권장
            }
            if (apiSecretKey == null || apiSecretKey.isEmpty()) {
                apiSecretKey = "YOUR_API_SECRET"; // 실제 운영에서는 환경 변수 사용 권장
            }
            
            // 클라이언트 초기화
            DefaultMessageService messageService = SolapiClient.createInstance(apiKey, apiSecretKey);
            
            System.out.println("환경 변수를 사용한 클라이언트 초기화 완료");
            
            // 환경 변수 설정 방법:
            // Windows: set SOLAPI_API_KEY=your_api_key
            // Linux/Mac: export SOLAPI_API_KEY=your_api_key
            
        } catch (Exception e) {
            System.err.println("환경 설정 오류: " + e.getMessage());
        }
    }
}`,
        usage: 'Java에서 API 키를 안전하게 관리해야 하는 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'kotlin-environment-setup',
        title: 'Kotlin 환경 변수 설정',
        description: 'Kotlin에서 환경 변수를 사용하여 API 키를 안전하게 관리하는 예제입니다.',
        category: '초기설정',
        keywords: ['kotlin', '환경변수', 'environment', 'api', 'key', 'secret', '보안', '설정'],
        code: `import com.solapi.sdk.SolapiClient
import com.solapi.sdk.message.service.DefaultMessageService

fun main() {
    try {
        // 환경 변수에서 API 키 읽기
        val apiKey = System.getenv("SOLAPI_API_KEY") ?: "YOUR_API_KEY"
        val apiSecretKey = System.getenv("SOLAPI_API_SECRET") ?: "YOUR_API_SECRET"
        
        // 클라이언트 초기화
        val messageService = SolapiClient.createInstance(apiKey, apiSecretKey)
        
        println("환경 변수를 사용한 클라이언트 초기화 완료")
        
        // 환경 변수 설정 방법:
        // Windows: set SOLAPI_API_KEY=your_api_key
        // Linux/Mac: export SOLAPI_API_KEY=your_api_key
        
    } catch (e: Exception) {
        System.err.println("환경 설정 오류: \${e.message}")
    }
}`,
        usage: 'Kotlin에서 API 키를 안전하게 관리해야 하는 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'java-properties-config',
        title: 'Java Properties 파일 설정',
        description: 'Java에서 Properties 파일을 사용하여 설정을 관리하는 예제입니다.',
        category: '초기설정',
        keywords: ['java', 'properties', '설정파일', 'config', 'api', 'key', 'secret'],
        code: `import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.service.DefaultMessageService;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class PropertiesConfigExample {
    public static void main(String[] args) {
        try {
            // Properties 파일 로드
            Properties props = new Properties();
            FileInputStream fis = new FileInputStream("solapi.properties");
            props.load(fis);
            fis.close();
            
            // 설정값 읽기
            String apiKey = props.getProperty("solapi.api.key");
            String apiSecretKey = props.getProperty("solapi.api.secret");
            String useStaticIP = props.getProperty("solapi.use.static.ip", "false");
            
            // 클라이언트 초기화
            boolean staticIP = Boolean.parseBoolean(useStaticIP);
            DefaultMessageService messageService = SolapiClient.createInstance(apiKey, apiSecretKey, staticIP);
            
            System.out.println("Properties 파일을 사용한 클라이언트 초기화 완료");
            
            // solapi.properties 파일 예시:
            // solapi.api.key=YOUR_API_KEY
            // solapi.api.secret=YOUR_API_SECRET
            // solapi.use.static.ip=false
            
        } catch (IOException e) {
            System.err.println("Properties 파일 로드 오류: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("설정 오류: " + e.getMessage());
        }
    }
}`,
        usage: 'Java에서 외부 설정 파일을 사용하여 관리해야 하는 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'java-spring-boot-config',
        title: 'Java Spring Boot 설정',
        description: 'Spring Boot에서 SOLAPI를 설정하고 사용하는 예제입니다.',
        category: '초기설정',
        keywords: ['java', 'spring', 'springboot', 'configuration', 'bean', 'api', 'key', 'secret'],
        code: `import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SolapiConfig {
    
    @Value("\${solapi.api.key}")
    private String apiKey;
    
    @Value("\${solapi.api.secret}")
    private String apiSecretKey;
    
    @Value("\${solapi.use.static.ip:false}")
    private boolean useStaticIP;
    
    @Bean
    public DefaultMessageService messageService() {
        return SolapiClient.createInstance(apiKey, apiSecretKey, useStaticIP);
    }
}

// 사용 예시
@Service
public class MessageService {
    
    @Autowired
    private DefaultMessageService solapiMessageService;
    
    public void sendSms(String to, String text) {
        try {
            Message message = new Message();
            message.setTo(to);
            message.setFrom("01087654321");
            message.setText(text);
            message.setType(MessageType.SMS);
            
            var result = solapiMessageService.send(message);
            System.out.println("SMS 발송 성공: " + result.getMessageList().get(0).getMessageId());
            
        } catch (Exception e) {
            System.err.println("SMS 발송 실패: " + e.getMessage());
        }
    }
}

// application.yml 설정 예시:
// solapi:
//   api:
//     key: YOUR_API_KEY
//     secret: YOUR_API_SECRET
//   use:
//     static:
//       ip: false`,
        usage: 'Spring Boot 프로젝트에서 SOLAPI를 사용해야 하는 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'java-custom-domain',
        title: 'Java 커스텀 도메인 설정',
        description: 'Java에서 커스텀 도메인을 사용하여 SOLAPI 클라이언트를 설정하는 예제입니다.',
        category: '초기설정',
        keywords: ['java', '커스텀', '도메인', 'domain', 'custom', 'api', 'url', '설정'],
        code: `import com.solapi.sdk.message.service.DefaultMessageService;
import com.solapi.sdk.message.lib.Authenticator;
import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.converter.kotlinx.serialization.asConverterFactory;
import kotlinx.serialization.json.Json;
import okhttp3.MediaType;
import java.util.concurrent.TimeUnit;

public class CustomDomainExample {
    public static void main(String[] args) {
        try {
            String apiKey = "YOUR_API_KEY";
            String apiSecretKey = "YOUR_API_SECRET";
            String customDomain = "https://your-custom-domain.com"; // 커스텀 도메인
            
            // 커스텀 클라이언트 설정
            OkHttpClient client = new OkHttpClient.Builder()
                .connectTimeout(50, TimeUnit.SECONDS)
                .readTimeout(50, TimeUnit.SECONDS)
                .writeTimeout(50, TimeUnit.SECONDS)
                .addInterceptor(chain -> {
                    // 인증 헤더 추가
                    Authenticator auth = new Authenticator(apiKey, apiSecretKey);
                    String authInfo = auth.generateAuthInfo();
                    return chain.proceed(chain.request().newBuilder()
                        .addHeader("Authorization", authInfo)
                        .build());
                })
                .build();
            
            // Retrofit 설정
            MediaType contentType = MediaType.parse("application/json");
            Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(customDomain)
                .addConverterFactory(Json.Default.asConverterFactory(contentType))
                .client(client)
                .build();
            
            // MessageService 생성
            DefaultMessageService messageService = new DefaultMessageService(apiKey, apiSecretKey, customDomain);
            
            System.out.println("커스텀 도메인을 사용한 클라이언트 초기화 완료");
            
        } catch (Exception e) {
            System.err.println("커스텀 도메인 설정 오류: " + e.getMessage());
        }
    }
}`,
        usage: 'Java에서 커스텀 도메인을 사용해야 하는 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'java-connection-pool',
        title: 'Java 연결 풀 설정',
        description: 'Java에서 연결 풀을 설정하여 성능을 최적화하는 예제입니다.',
        category: '초기설정',
        keywords: ['java', '연결풀', 'connection', 'pool', '성능', 'optimization', '설정'],
        code: `import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.service.DefaultMessageService;
import okhttp3.OkHttpClient;
import java.util.concurrent.TimeUnit;

public class ConnectionPoolExample {
    public static void main(String[] args) {
        try {
            String apiKey = "YOUR_API_KEY";
            String apiSecretKey = "YOUR_API_SECRET";
            
            // 연결 풀 설정
            OkHttpClient client = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(60, TimeUnit.SECONDS)
                .connectionPool(new okhttp3.ConnectionPool(
                    10, // 최대 연결 수
                    5,  // 유지 시간 (분)
                    TimeUnit.MINUTES
                ))
                .retryOnConnectionFailure(true)
                .build();
            
            // 커스텀 클라이언트를 사용한 MessageService 생성
            DefaultMessageService messageService = new DefaultMessageService(apiKey, apiSecretKey, "https://api.solapi.com");
            
            System.out.println("연결 풀을 사용한 클라이언트 초기화 완료");
            
            // 대량 발송 시 연결 풀의 이점을 활용할 수 있습니다
            for (int i = 0; i < 100; i++) {
                // 메시지 발송 로직
                // 연결 풀로 인해 성능이 향상됩니다
            }
            
        } catch (Exception e) {
            System.err.println("연결 풀 설정 오류: " + e.getMessage());
        }
    }
}`,
        usage: 'Java에서 대량 메시지 발송 시 성능 최적화가 필요한 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'java-logging-config',
        title: 'Java 로깅 설정',
        description: 'Java에서 SOLAPI 사용 시 로깅을 설정하는 예제입니다.',
        category: '초기설정',
        keywords: ['java', '로깅', 'logging', 'log', 'debug', '설정', 'monitoring'],
        code: `import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.service.DefaultMessageService;
import com.solapi.sdk.message.model.Message;
import com.solapi.sdk.message.model.MessageType;
import java.util.logging.Logger;
import java.util.logging.Level;

public class LoggingConfigExample {
    private static final Logger logger = Logger.getLogger(LoggingConfigExample.class.getName());
    
    public static void main(String[] args) {
        try {
            // 로깅 레벨 설정
            logger.setLevel(Level.INFO);
            
            String apiKey = "YOUR_API_KEY";
            String apiSecretKey = "YOUR_API_SECRET";
            
            // 클라이언트 초기화
            DefaultMessageService messageService = SolapiClient.createInstance(apiKey, apiSecretKey);
            
            logger.info("SOLAPI 클라이언트 초기화 완료");
            
            // 메시지 발송 시 로깅
            Message message = new Message();
            message.setTo("01012345678");
            message.setFrom("01087654321");
            message.setText("로깅 테스트 메시지입니다.");
            message.setType(MessageType.SMS);
            
            logger.info("메시지 발송 시작: " + message.getTo());
            
            var result = messageService.send(message);
            
            logger.info("메시지 발송 성공: " + result.getMessageList().get(0).getMessageId());
            
        } catch (Exception e) {
            logger.severe("메시지 발송 실패: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

// logback.xml 설정 예시 (Spring Boot 사용 시):
/*
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <logger name="com.solapi" level="DEBUG" />
    
    <root level="INFO">
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
*/`,
        usage: 'Java에서 SOLAPI 사용 시 로깅이 필요한 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'kotlin-spring-boot-config',
        title: 'Kotlin Spring Boot 설정',
        description: 'Kotlin Spring Boot에서 SOLAPI를 설정하고 사용하는 예제입니다.',
        category: '초기설정',
        keywords: ['kotlin', 'spring', 'springboot', 'configuration', 'bean', 'api', 'key', 'secret'],
        code: `import com.solapi.sdk.SolapiClient
import com.solapi.sdk.message.service.DefaultMessageService
import com.solapi.sdk.message.model.Message
import com.solapi.sdk.message.model.MessageType
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.stereotype.Service
import org.springframework.beans.factory.annotation.Autowired

@Configuration
class SolapiConfig {
    
    @Value("\${solapi.api.key}")
    private lateinit var apiKey: String
    
    @Value("\${solapi.api.secret}")
    private lateinit var apiSecretKey: String
    
    @Value("\${solapi.use.static.ip:false}")
    private var useStaticIP: Boolean = false
    
    @Bean
    fun messageService(): DefaultMessageService {
        return SolapiClient.createInstance(apiKey, apiSecretKey, useStaticIP)
    }
}

// 사용 예시
@Service
class MessageService {
    
    @Autowired
    private lateinit var solapiMessageService: DefaultMessageService
    
    fun sendSms(to: String, text: String) {
        try {
            val message = Message().apply {
                this.to = to
                from = "01087654321"
                this.text = text
                type = MessageType.SMS
            }
            
            val result = solapiMessageService.send(message)
            println("SMS 발송 성공: \${result.messageList.first().messageId}")
            
        } catch (e: Exception) {
            System.err.println("SMS 발송 실패: \${e.message}")
        }
    }
}

// application.yml 설정 예시:
// solapi:
//   api:
//     key: YOUR_API_KEY
//     secret: YOUR_API_SECRET
//   use:
//     static:
//       ip: false`,
        usage: 'Kotlin Spring Boot 프로젝트에서 SOLAPI를 사용해야 하는 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'kotlin-coroutines-config',
        title: 'Kotlin 코루틴 설정',
        description: 'Kotlin에서 코루틴을 사용하여 비동기적으로 SOLAPI를 사용하는 고급 설정 예제입니다.',
        category: '초기설정',
        keywords: ['kotlin', '코루틴', 'coroutine', '비동기', 'async', 'await', '설정'],
        code: `import com.solapi.sdk.SolapiClient
import com.solapi.sdk.message.service.DefaultMessageService
import com.solapi.sdk.message.model.Message
import com.solapi.sdk.message.model.MessageType
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.sync.Semaphore
import java.util.concurrent.atomic.AtomicInteger

class AsyncMessageService {
    private val messageService: DefaultMessageService
    private val semaphore: Semaphore
    private val successCount = AtomicInteger(0)
    private val failureCount = AtomicInteger(0)
    
    constructor(apiKey: String, apiSecretKey: String, maxConcurrent: Int = 10) {
        messageService = SolapiClient.createInstance(apiKey, apiSecretKey)
        semaphore = Semaphore(maxConcurrent)
    }
    
    suspend fun sendMessageAsync(to: String, text: String): Result<String> = withContext(Dispatchers.IO) {
        semaphore.withPermit {
            try {
                val message = Message().apply {
                    this.to = to
                    from = "01087654321"
                    this.text = text
                    type = MessageType.SMS
                }
                
                val result = messageService.send(message)
                successCount.incrementAndGet()
                Result.success(result.messageList.first().messageId)
                
            } catch (e: Exception) {
                failureCount.incrementAndGet()
                Result.failure(e)
            }
        }
    }
    
    suspend fun sendBulkMessagesAsync(messages: List<Pair<String, String>>): List<Result<String>> {
        return messages.map { (to, text) ->
            async { sendMessageAsync(to, text) }
        }.awaitAll()
    }
    
    fun getStats(): Pair<Int, Int> = Pair(successCount.get(), failureCount.get())
}

fun main() = runBlocking {
    val asyncService = AsyncMessageService("YOUR_API_KEY", "YOUR_API_SECRET", 5)
    
    val messages = listOf(
        "01012345678" to "첫 번째 메시지",
        "01011111111" to "두 번째 메시지",
        "01022222222" to "세 번째 메시지"
    )
    
    println("비동기 메시지 발송 시작...")
    val results = asyncService.sendBulkMessagesAsync(messages)
    
    results.forEachIndexed { index, result ->
        if (result.isSuccess) {
            println("메시지 \${index + 1} 발송 성공: \${result.getOrNull()}")
        } else {
            println("메시지 \${index + 1} 발송 실패: \${result.exceptionOrNull()?.message}")
        }
    }
    
    val (success, failure) = asyncService.getStats()
    println("발송 완료 - 성공: $success, 실패: $failure")
}`,
        usage: 'Kotlin에서 대량 메시지 발송 시 비동기 처리가 필요한 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'java-api-key-validation',
        title: 'Java API 키 유효성 검증',
        description: 'Java에서 API 키의 유효성을 검증하는 예제입니다.',
        category: '초기설정',
        keywords: ['java', 'api', 'key', 'validation', '유효성', '검증', '인증'],
        code: `import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.service.DefaultMessageService;
import com.solapi.sdk.message.exception.SolapiInvalidApiKeyException;
import com.solapi.sdk.message.model.Balance;

public class ApiKeyValidationExample {
    
    public static boolean validateApiKey(String apiKey, String apiSecretKey) {
        try {
            // 클라이언트 초기화
            DefaultMessageService messageService = SolapiClient.createInstance(apiKey, apiSecretKey);
            
            // 잔액 조회로 API 키 유효성 검증
            Balance balance = messageService.getBalance();
            
            System.out.println("API 키 유효성 검증 성공");
            System.out.println("현재 잔액: " + balance.getBalance());
            System.out.println("포인트: " + balance.getPoint());
            
            return true;
            
        } catch (SolapiInvalidApiKeyException e) {
            System.err.println("API 키가 유효하지 않습니다: " + e.getMessage());
            return false;
        } catch (Exception e) {
            System.err.println("API 키 검증 중 오류 발생: " + e.getMessage());
            return false;
        }
    }
    
    public static void main(String[] args) {
        String apiKey = "YOUR_API_KEY";
        String apiSecretKey = "YOUR_API_SECRET";
        
        if (validateApiKey(apiKey, apiSecretKey)) {
            System.out.println("API 키가 유효합니다. 메시지 발송을 시작할 수 있습니다.");
        } else {
            System.out.println("API 키가 유효하지 않습니다. 설정을 확인해주세요.");
        }
    }
}`,
        usage: 'Java에서 API 키의 유효성을 확인해야 하는 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'kotlin-api-key-validation',
        title: 'Kotlin API 키 유효성 검증',
        description: 'Kotlin에서 API 키의 유효성을 검증하는 예제입니다.',
        category: '초기설정',
        keywords: ['kotlin', 'api', 'key', 'validation', '유효성', '검증', '인증'],
        code: `import com.solapi.sdk.SolapiClient
import com.solapi.sdk.message.service.DefaultMessageService
import com.solapi.sdk.message.exception.SolapiInvalidApiKeyException
import com.solapi.sdk.message.model.Balance

object ApiKeyValidationExample {
    
    fun validateApiKey(apiKey: String, apiSecretKey: String): Boolean {
        return try {
            // 클라이언트 초기화
            val messageService = SolapiClient.createInstance(apiKey, apiSecretKey)
            
            // 잔액 조회로 API 키 유효성 검증
            val balance = messageService.getBalance()
            
            println("API 키 유효성 검증 성공")
            println("현재 잔액: \${balance.balance}")
            println("포인트: \${balance.point}")
            
            true
            
        } catch (e: SolapiInvalidApiKeyException) {
            System.err.println("API 키가 유효하지 않습니다: \${e.message}")
            false
        } catch (e: Exception) {
            System.err.println("API 키 검증 중 오류 발생: \${e.message}")
            false
        }
    }
}

fun main() {
    val apiKey = "YOUR_API_KEY"
    val apiSecretKey = "YOUR_API_SECRET"
    
    if (ApiKeyValidationExample.validateApiKey(apiKey, apiSecretKey)) {
        println("API 키가 유효합니다. 메시지 발송을 시작할 수 있습니다.")
    } else {
        println("API 키가 유효하지 않습니다. 설정을 확인해주세요.")
    }
}`,
        usage: 'Kotlin에서 API 키의 유효성을 확인해야 하는 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'java-sms-send',
        title: 'Java SMS 기본 발송',
        description: 'Java에서 단문 메시지를 발송하는 기본적인 예제입니다.',
        category: 'SMS',
        keywords: ['java', 'sms', '발송', '기본', '단문', '메시지', 'send'],
        code: `import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.service.DefaultMessageService;
import com.solapi.sdk.message.model.Message;
import com.solapi.sdk.message.model.MessageType;

public class SmsExample {
    public static void main(String[] args) {
        try {
            // 클라이언트 초기화
            DefaultMessageService messageService = SolapiClient.createInstance("YOUR_API_KEY", "YOUR_API_SECRET");
            
            // 메시지 생성
            Message message = new Message();
            message.setTo("01012345678");
            message.setFrom("01087654321");
            message.setText("안녕하세요! SOLAPI Java 테스트 메시지입니다.");
            message.setType(MessageType.SMS);
            
            // 메시지 발송
            var sendResult = messageService.send(message);
            
            System.out.println("SMS 발송 성공:");
            System.out.println("메시지 ID: " + sendResult.getMessageList().get(0).getMessageId());
            System.out.println("상태: " + sendResult.getMessageList().get(0).getStatusCode());
            
        } catch (Exception e) {
            System.err.println("SMS 발송 실패: " + e.getMessage());
        }
    }
}`,
        usage: 'Java에서 기본적인 SMS 발송이 필요한 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'kotlin-sms-send',
        title: 'Kotlin SMS 기본 발송',
        description: 'Kotlin에서 단문 메시지를 발송하는 기본적인 예제입니다.',
        category: 'SMS',
        keywords: ['kotlin', 'sms', '발송', '기본', '단문', '메시지', 'send'],
        code: `import com.solapi.sdk.SolapiClient
import com.solapi.sdk.message.service.DefaultMessageService
import com.solapi.sdk.message.model.Message
import com.solapi.sdk.message.model.MessageType

fun main() {
    try {
        // 클라이언트 초기화
        val messageService = SolapiClient.createInstance("YOUR_API_KEY", "YOUR_API_SECRET")
        
        // 메시지 생성
        val message = Message().apply {
            to = "01012345678"
            from = "01087654321"
            text = "안녕하세요! SOLAPI Kotlin 테스트 메시지입니다."
            type = MessageType.SMS
        }
        
        // 메시지 발송
        val sendResult = messageService.send(message)
        
        println("SMS 발송 성공:")
        println("메시지 ID: \${sendResult.messageList.first().messageId}")
        println("상태: \${sendResult.messageList.first().statusCode}")
        
    } catch (e: Exception) {
        System.err.println("SMS 발송 실패: \${e.message}")
    }
}`,
        usage: 'Kotlin에서 기본적인 SMS 발송이 필요한 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'java-lms-send',
        title: 'Java LMS 발송',
        description: 'Java에서 장문 메시지 서비스(LMS)를 발송하는 예제입니다.',
        category: 'LMS',
        keywords: ['java', 'lms', '장문', '발송', '제목', '2000바이트'],
        code: `import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.service.DefaultMessageService;
import com.solapi.sdk.message.model.Message;
import com.solapi.sdk.message.model.MessageType;

public class LmsExample {
    public static void main(String[] args) {
        try {
            // 클라이언트 초기화
            DefaultMessageService messageService = SolapiClient.createInstance("YOUR_API_KEY", "YOUR_API_SECRET");
            
            // LMS 메시지 생성
            Message message = new Message();
            message.setTo("01012345678");
            message.setFrom("01087654321");
            message.setText("안녕하세요! SOLAPI LMS 테스트 메시지입니다.\\n\\n" +
                          "이 메시지는 장문 메시지 서비스(LMS)로 발송되었습니다.\\n\\n" +
                          "LMS는 최대 2000바이트까지 전송할 수 있으며, 제목을 포함할 수 있습니다.");
            message.setSubject("SOLAPI LMS 테스트");
            message.setType(MessageType.LMS);
            
            // 메시지 발송
            var sendResult = messageService.send(message);
            
            System.out.println("LMS 발송 성공:");
            System.out.println("메시지 ID: " + sendResult.getMessageList().get(0).getMessageId());
            System.out.println("상태: " + sendResult.getMessageList().get(0).getStatusCode());
            
        } catch (Exception e) {
            System.err.println("LMS 발송 실패: " + e.getMessage());
        }
    }
}`,
        usage: 'Java에서 긴 내용의 메시지를 발송해야 하는 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'java-alimtalk-send',
        title: 'Java 알림톡 발송',
        description: 'Java에서 카카오톡 알림톡을 발송하는 예제입니다.',
        category: '알림톡',
        keywords: ['java', '알림톡', '카카오톡', '템플릿', '변수', '버튼', 'kakao'],
        code: `import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.service.DefaultMessageService;
import com.solapi.sdk.message.model.Message;
import com.solapi.sdk.message.model.MessageType;
import com.solapi.sdk.message.model.kakao.KakaoOption;
import com.solapi.sdk.message.model.kakao.KakaoButton;
import com.solapi.sdk.message.model.kakao.KakaoButtonType;
import java.util.HashMap;
import java.util.Arrays;

public class AlimtalkExample {
    public static void main(String[] args) {
        try {
            // 클라이언트 초기화
            DefaultMessageService messageService = SolapiClient.createInstance("YOUR_API_KEY", "YOUR_API_SECRET");
            
            // 카카오 옵션 설정
            KakaoOption kakaoOption = new KakaoOption();
            kakaoOption.setPfId("YOUR_PF_ID");
            kakaoOption.setTemplateId("YOUR_TEMPLATE_ID");
            
            // 변수 설정
            HashMap<String, String> variables = new HashMap<>();
            variables.put("name", "홍길동");
            variables.put("amount", "10,000원");
            kakaoOption.setVariables(variables);
            
            // 버튼 설정
            KakaoButton button = new KakaoButton();
            button.setName("자세히 보기");
            button.setType(KakaoButtonType.WL);
            button.setUrl("https://developers.solapi.com");
            kakaoOption.setButtons(Arrays.asList(button));
            
            // 메시지 생성
            Message message = new Message();
            message.setTo("01012345678");
            message.setFrom("01087654321");
            message.setText("안녕하세요! SOLAPI 알림톡 테스트입니다.");
            message.setKakaoOptions(kakaoOption);
            message.setType(MessageType.ATA);
            
            // 메시지 발송
            var sendResult = messageService.send(message);
            
            System.out.println("알림톡 발송 성공:");
            System.out.println("메시지 ID: " + sendResult.getMessageList().get(0).getMessageId());
            System.out.println("상태: " + sendResult.getMessageList().get(0).getStatusCode());
            
        } catch (Exception e) {
            System.err.println("알림톡 발송 실패: " + e.getMessage());
        }
    }
}`,
        usage: 'Java에서 카카오톡 알림톡을 발송해야 하는 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'kotlin-alimtalk-send',
        title: 'Kotlin 알림톡 발송',
        description: 'Kotlin에서 카카오톡 알림톡을 발송하는 예제입니다.',
        category: '알림톡',
        keywords: ['kotlin', '알림톡', '카카오톡', '템플릿', '변수', '버튼', 'kakao'],
        code: `import com.solapi.sdk.SolapiClient
import com.solapi.sdk.message.service.DefaultMessageService
import com.solapi.sdk.message.model.Message
import com.solapi.sdk.message.model.MessageType
import com.solapi.sdk.message.model.kakao.KakaoOption
import com.solapi.sdk.message.model.kakao.KakaoButton
import com.solapi.sdk.message.model.kakao.KakaoButtonType

fun main() {
    try {
        // 클라이언트 초기화
        val messageService = SolapiClient.createInstance("YOUR_API_KEY", "YOUR_API_SECRET")
        
        // 카카오 옵션 설정
        val kakaoOption = KakaoOption().apply {
            pfId = "YOUR_PF_ID"
            templateId = "YOUR_TEMPLATE_ID"
            
            // 변수 설정
            variables = mapOf(
                "name" to "홍길동",
                "amount" to "10,000원"
            )
            
            // 버튼 설정
            buttons = listOf(
                KakaoButton().apply {
                    name = "자세히 보기"
                    type = KakaoButtonType.WL
                    url = "https://developers.solapi.com"
                }
            )
        }
        
        // 메시지 생성
        val message = Message().apply {
            to = "01012345678"
            from = "01087654321"
            text = "안녕하세요! SOLAPI 알림톡 테스트입니다."
            kakaoOptions = kakaoOption
            type = MessageType.ATA
        }
        
        // 메시지 발송
        val sendResult = messageService.send(message)
        
        println("알림톡 발송 성공:")
        println("메시지 ID: \${sendResult.messageList.first().messageId}")
        println("상태: \${sendResult.messageList.first().statusCode}")
        
    } catch (e: Exception) {
        System.err.println("알림톡 발송 실패: \${e.message}")
    }
}`,
        usage: 'Kotlin에서 카카오톡 알림톡을 발송해야 하는 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'java-balance-check',
        title: 'Java 잔액 확인',
        description: 'Java에서 계정의 현재 잔액을 확인하는 예제입니다.',
        category: '계정관리',
        keywords: ['java', '잔액', 'balance', '포인트', '확인', '조회'],
        code: `import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.service.DefaultMessageService;
import com.solapi.sdk.message.model.Balance;

public class BalanceExample {
    public static void main(String[] args) {
        try {
            // 클라이언트 초기화
            DefaultMessageService messageService = SolapiClient.createInstance("YOUR_API_KEY", "YOUR_API_SECRET");
            
            // 잔액 조회
            Balance balance = messageService.getBalance();
            
            System.out.println("현재 잔액: " + balance.getBalance());
            System.out.println("포인트: " + balance.getPoint());
            
        } catch (Exception e) {
            System.err.println("잔액 조회 실패: " + e.getMessage());
        }
    }
}`,
        usage: 'Java에서 발송 전 잔액을 확인하거나 정기적인 잔액 체크가 필요한 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'java-message-status',
        title: 'Java 메시지 상태 조회',
        description: 'Java에서 발송한 메시지의 상태를 조회하는 예제입니다.',
        category: '상태조회',
        keywords: ['java', '상태', '조회', '메시지', '발송', '결과'],
        code: `import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.service.DefaultMessageService;
import com.solapi.sdk.message.dto.request.MessageListRequest;
import com.solapi.sdk.message.dto.response.MessageListResponse;

public class MessageStatusExample {
    public static void main(String[] args) {
        try {
            // 클라이언트 초기화
            DefaultMessageService messageService = SolapiClient.createInstance("YOUR_API_KEY", "YOUR_API_SECRET");
            
            // 메시지 조회 요청 생성
            MessageListRequest request = new MessageListRequest();
            request.setMessageId("YOUR_MESSAGE_ID");
            request.setLimit(10);
            
            // 메시지 상태 조회
            MessageListResponse response = messageService.getMessageList(request);
            
            if (response != null && response.getMessageList() != null) {
                System.out.println("메시지 상태 조회 성공:");
                response.getMessageList().forEach(message -> {
                    System.out.println("메시지 ID: " + message.getMessageId());
                    System.out.println("상태: " + message.getStatusCode());
                    System.out.println("발송 시간: " + message.getDateProcessed());
                    System.out.println("---");
                });
            } else {
                System.out.println("조회된 메시지가 없습니다.");
            }
            
        } catch (Exception e) {
            System.err.println("메시지 상태 조회 실패: " + e.getMessage());
        }
    }
}`,
        usage: 'Java에서 발송한 메시지의 상태를 확인해야 하는 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'java-scheduled-send',
        title: 'Java 예약 발송',
        description: 'Java에서 특정 시간에 메시지를 발송하도록 예약하는 예제입니다.',
        category: '예약발송',
        keywords: ['java', '예약', '발송', '스케줄', '시간', '지연'],
        code: `import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.service.DefaultMessageService;
import com.solapi.sdk.message.model.Message;
import com.solapi.sdk.message.model.MessageType;
import com.solapi.sdk.message.dto.request.SendRequestConfig;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ScheduledSendExample {
    public static void main(String[] args) {
        try {
            // 클라이언트 초기화
            DefaultMessageService messageService = SolapiClient.createInstance("YOUR_API_KEY", "YOUR_API_SECRET");
            
            // 메시지 생성
            Message message = new Message();
            message.setTo("01012345678");
            message.setFrom("01087654321");
            message.setText("예약 발송된 메시지입니다.");
            message.setType(MessageType.SMS);
            
            // 예약 발송 설정 (현재 시간으로부터 1시간 후)
            LocalDateTime scheduledTime = LocalDateTime.now().plusHours(1);
            String scheduledDate = scheduledTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            
            SendRequestConfig config = new SendRequestConfig();
            config.setScheduledDate(scheduledDate);
            
            // 예약 발송
            var sendResult = messageService.send(message, config);
            
            System.out.println("예약 발송 성공:");
            System.out.println("메시지 ID: " + sendResult.getMessageList().get(0).getMessageId());
            System.out.println("예약 시간: " + scheduledDate);
            
        } catch (Exception e) {
            System.err.println("예약 발송 실패: " + e.getMessage());
        }
    }
}`,
        usage: 'Java에서 특정 시간에 메시지를 발송해야 하는 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'java-error-handling',
        title: 'Java 에러 처리',
        description: 'Java에서 SOLAPI 사용 시 발생할 수 있는 에러를 처리하는 예제입니다.',
        category: '에러처리',
        keywords: ['java', '에러', '처리', '예외', '오류', '핸들링'],
        code: `import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.service.DefaultMessageService;
import com.solapi.sdk.message.model.Message;
import com.solapi.sdk.message.model.MessageType;
import com.solapi.sdk.message.exception.*;

public class ErrorHandlingExample {
    public static void main(String[] args) {
        try {
            // 클라이언트 초기화
            DefaultMessageService messageService = SolapiClient.createInstance("YOUR_API_KEY", "YOUR_API_SECRET");
            
            // 메시지 생성
            Message message = new Message();
            message.setTo("01012345678");
            message.setFrom("01087654321");
            message.setText("안녕하세요! SOLAPI Java 테스트 메시지입니다.");
            message.setType(MessageType.SMS);
            
            // 메시지 발송
            var sendResult = messageService.send(message);
            System.out.println("발송 성공: " + sendResult.getMessageList().get(0).getMessageId());
            
        } catch (SolapiInvalidApiKeyException e) {
            System.err.println("잘못된 API 키: " + e.getMessage());
        } catch (SolapiBadRequestException e) {
            System.err.println("잘못된 요청: " + e.getMessage());
        } catch (SolapiMessageNotReceivedException e) {
            System.err.println("메시지 수신 실패: " + e.getMessage());
        } catch (SolapiEmptyResponseException e) {
            System.err.println("빈 응답: " + e.getMessage());
        } catch (SolapiUnknownException e) {
            System.err.println("알 수 없는 오류: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("일반 오류: " + e.getMessage());
        }
    }
}`,
        usage: 'Java에서 안정적인 메시지 발송을 위해 에러 처리가 필요한 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'java-file-upload',
        title: 'Java 파일 업로드',
        description: 'Java에서 MMS나 팩스 발송을 위한 파일을 업로드하는 예제입니다.',
        category: '파일업로드',
        keywords: ['java', '파일', '업로드', 'mms', '팩스', '이미지'],
        code: `import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.service.DefaultMessageService;
import com.solapi.sdk.message.model.StorageType;
import java.io.File;

public class FileUploadExample {
    public static void main(String[] args) {
        try {
            // 클라이언트 초기화
            DefaultMessageService messageService = SolapiClient.createInstance("YOUR_API_KEY", "YOUR_API_SECRET");
            
            // 업로드할 파일 경로
            File imageFile = new File("path/to/your/image.jpg");
            
            if (!imageFile.exists()) {
                System.err.println("파일이 존재하지 않습니다: " + imageFile.getAbsolutePath());
                return;
            }
            
            // 파일 업로드 (MMS용)
            String fileId = messageService.uploadFile(imageFile, StorageType.MMS);
            
            System.out.println("파일 업로드 성공:");
            System.out.println("파일 ID: " + fileId);
            
            // 업로드된 파일 ID를 사용하여 MMS 발송 가능
            // message.setImageId(fileId);
            
        } catch (SolapiFileUploadException e) {
            System.err.println("파일 업로드 실패: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("오류 발생: " + e.getMessage());
        }
    }
}`,
        usage: 'Java에서 MMS나 팩스 발송을 위해 파일을 업로드해야 하는 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'java-mms-send',
        title: 'Java MMS 발송',
        description: 'Java에서 이미지가 포함된 사진 문자를 발송하는 예제입니다.',
        category: 'MMS',
        keywords: ['java', 'mms', '사진', '이미지', '멀티미디어', '첨부파일'],
        code: `import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.service.DefaultMessageService;
import com.solapi.sdk.message.model.Message;
import com.solapi.sdk.message.model.MessageType;
import com.solapi.sdk.message.model.StorageType;
import java.io.File;

public class MmsExample {
    public static void main(String[] args) {
        try {
            // 클라이언트 초기화
            DefaultMessageService messageService = SolapiClient.createInstance("YOUR_API_KEY", "YOUR_API_SECRET");
            
            // 이미지 파일 업로드
            File imageFile = new File("path/to/your/image.jpg");
            String fileId = messageService.uploadFile(imageFile, StorageType.MMS);
            
            // MMS 메시지 생성
            Message message = new Message();
            message.setTo("01012345678");
            message.setFrom("01087654321");
            message.setText("사진 문자 테스트입니다.");
            message.setSubject("MMS 테스트");
            message.setImageId(fileId);
            message.setType(MessageType.MMS);
            
            // MMS 발송
            var sendResult = messageService.send(message);
            
            System.out.println("MMS 발송 성공:");
            System.out.println("메시지 ID: " + sendResult.getMessageList().get(0).getMessageId());
            System.out.println("상태: " + sendResult.getMessageList().get(0).getStatusCode());
            
        } catch (Exception e) {
            System.err.println("MMS 발송 실패: " + e.getMessage());
        }
    }
}`,
        usage: 'Java에서 이미지와 함께 메시지를 발송해야 하는 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'java-voice-send',
        title: 'Java 음성 메시지 발송',
        description: 'Java에서 음성으로 메시지를 전달하는 예제입니다.',
        category: '음성메시지',
        keywords: ['java', '음성', 'voice', '전화', 'tts', '남성', '여성'],
        code: `import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.service.DefaultMessageService;
import com.solapi.sdk.message.model.Message;
import com.solapi.sdk.message.model.MessageType;
import com.solapi.sdk.message.model.voice.VoiceOption;
import com.solapi.sdk.message.model.voice.VoiceType;

public class VoiceExample {
    public static void main(String[] args) {
        try {
            // 클라이언트 초기화
            DefaultMessageService messageService = SolapiClient.createInstance("YOUR_API_KEY", "YOUR_API_SECRET");
            
            // 음성 옵션 설정
            VoiceOption voiceOption = new VoiceOption();
            voiceOption.setVoiceType(VoiceType.FEMALE); // MALE 또는 FEMALE
            voiceOption.setHeaderMessage("보이스 메시지 테스트");
            voiceOption.setTailMessage("감사합니다.");
            
            // 메시지 생성
            Message message = new Message();
            message.setTo("01012345678");
            message.setFrom("01087654321");
            message.setText("음성 메시지 테스트입니다. 실제 수신자에게 들리는 내용입니다.");
            message.setVoiceOptions(voiceOption);
            message.setType(MessageType.CTA);
            
            // 음성 메시지 발송
            var sendResult = messageService.send(message);
            
            System.out.println("음성 메시지 발송 성공:");
            System.out.println("메시지 ID: " + sendResult.getMessageList().get(0).getMessageId());
            System.out.println("상태: " + sendResult.getMessageList().get(0).getStatusCode());
            
        } catch (Exception e) {
            System.err.println("음성 메시지 발송 실패: " + e.getMessage());
        }
    }
}`,
        usage: 'Java에서 문자 대신 음성으로 메시지를 전달해야 하는 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'java-bulk-send',
        title: 'Java 대량 발송',
        description: 'Java에서 여러 수신자에게 동시에 메시지를 발송하는 예제입니다.',
        category: '대량발송',
        keywords: ['java', '대량', '발송', '여러', '수신자', '배열', 'sendMany'],
        code: `import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.service.DefaultMessageService;
import com.solapi.sdk.message.model.Message;
import com.solapi.sdk.message.model.MessageType;
import java.util.Arrays;
import java.util.List;

public class BulkSendExample {
    public static void main(String[] args) {
        try {
            // 클라이언트 초기화
            DefaultMessageService messageService = SolapiClient.createInstance("YOUR_API_KEY", "YOUR_API_SECRET");
            
            // 여러 메시지 생성
            List<Message> messages = Arrays.asList(
                createMessage("01012345678", "첫 번째 수신자에게 보내는 메시지입니다."),
                createMessage("01011111111", "두 번째 수신자에게 보내는 메시지입니다."),
                createMessage("01022222222", "세 번째 수신자에게 보내는 메시지입니다.")
            );
            
            // 대량 발송
            var sendResult = messageService.send(messages);
            
            System.out.println("대량 발송 성공:");
            System.out.println("총 발송 건수: " + sendResult.getMessageList().size());
            
            sendResult.getMessageList().forEach(message -> {
                System.out.println("메시지 ID: " + message.getMessageId());
                System.out.println("수신자: " + message.getTo());
                System.out.println("상태: " + message.getStatusCode());
                System.out.println("---");
            });
            
        } catch (Exception e) {
            System.err.println("대량 발송 실패: " + e.getMessage());
        }
    }
    
    private static Message createMessage(String to, String text) {
        Message message = new Message();
        message.setTo(to);
        message.setFrom("01087654321");
        message.setText(text);
        message.setType(MessageType.SMS);
        return message;
    }
}`,
        usage: 'Java에서 여러 명에게 동일하거나 다른 메시지를 발송해야 하는 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'java-kakao-template-management',
        title: 'Java 카카오 템플릿 관리',
        description: 'Java에서 카카오 알림톡 템플릿을 생성, 조회, 수정하는 예제입니다.',
        category: '템플릿관리',
        keywords: ['java', '카카오', '템플릿', '알림톡', '생성', '조회', '수정'],
        code: `import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.service.DefaultMessageService;
import com.solapi.sdk.message.dto.request.kakao.KakaoAlimtalkTemplateMutationRequest;
import com.solapi.sdk.message.dto.request.kakao.KakaoAlimtalkTemplateListRequest;
import com.solapi.sdk.message.dto.response.kakao.KakaoAlimtalkTemplateResponse;
import com.solapi.sdk.message.dto.response.kakao.KakaoAlimtalkTemplateListResponse;
import com.solapi.sdk.message.model.kakao.KakaoAlimtalkTemplateCategory;

public class KakaoTemplateExample {
    public static void main(String[] args) {
        try {
            // 클라이언트 초기화
            DefaultMessageService messageService = SolapiClient.createInstance("YOUR_API_KEY", "YOUR_API_SECRET");
            
            // 1. 템플릿 카테고리 조회
            System.out.println("=== 템플릿 카테고리 조회 ===");
            List<KakaoAlimtalkTemplateCategory> categories = messageService.getKakaoAlimtalkTemplateCategories();
            categories.forEach(category -> {
                System.out.println("카테고리 ID: " + category.getId());
                System.out.println("카테고리명: " + category.getName());
                System.out.println("---");
            });
            
            // 2. 템플릿 목록 조회
            System.out.println("=== 템플릿 목록 조회 ===");
            KakaoAlimtalkTemplateListRequest listRequest = new KakaoAlimtalkTemplateListRequest();
            listRequest.setLimit(10);
            KakaoAlimtalkTemplateListResponse listResponse = messageService.getKakaoAlimtalkTemplates(listRequest);
            
            if (listResponse.getTemplateList() != null) {
                listResponse.getTemplateList().forEach(template -> {
                    System.out.println("템플릿 ID: " + template.getTemplateId());
                    System.out.println("템플릿명: " + template.getName());
                    System.out.println("상태: " + template.getStatus());
                    System.out.println("---");
                });
            }
            
            // 3. 특정 템플릿 조회
            System.out.println("=== 특정 템플릿 조회 ===");
            String templateId = "YOUR_TEMPLATE_ID";
            KakaoAlimtalkTemplateResponse templateResponse = messageService.getKakaoAlimtalkTemplate(templateId);
            System.out.println("템플릿명: " + templateResponse.getName());
            System.out.println("상태: " + templateResponse.getStatus());
            
        } catch (Exception e) {
            System.err.println("카카오 템플릿 관리 실패: " + e.getMessage());
        }
    }
}`,
        usage: 'Java에서 카카오 알림톡 템플릿을 관리해야 하는 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'java-quota-check',
        title: 'Java 일일 발송량 한도 조회',
        description: 'Java에서 일일 발송량 한도를 조회하는 예제입니다.',
        category: '계정관리',
        keywords: ['java', '일일', '발송량', '한도', 'quota', '조회'],
        code: `import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.service.DefaultMessageService;
import com.solapi.sdk.message.model.Quota;

public class QuotaExample {
    public static void main(String[] args) {
        try {
            // 클라이언트 초기화
            DefaultMessageService messageService = SolapiClient.createInstance("YOUR_API_KEY", "YOUR_API_SECRET");
            
            // 일일 발송량 한도 조회
            Quota quota = messageService.getQuota();
            
            System.out.println("일일 발송량 한도 정보:");
            System.out.println("SMS 한도: " + quota.getSms());
            System.out.println("LMS 한도: " + quota.getLms());
            System.out.println("MMS 한도: " + quota.getMms());
            System.out.println("ATA 한도: " + quota.getAta());
            System.out.println("CTA 한도: " + quota.getCta());
            
        } catch (Exception e) {
            System.err.println("일일 발송량 한도 조회 실패: " + e.getMessage());
        }
    }
}`,
        usage: 'Java에서 일일 발송량 한도를 확인해야 하는 경우',
        url: 'https://github.com/solapi/solapi-java'
      },
      {
        id: 'kotlin-coroutines-example',
        title: 'Kotlin 코루틴 사용 예제',
        description: 'Kotlin 코루틴을 사용하여 비동기적으로 메시지를 발송하는 예제입니다.',
        category: 'Kotlin',
        keywords: ['kotlin', '코루틴', 'coroutine', '비동기', 'async', 'await'],
        code: `import com.solapi.sdk.SolapiClient
import com.solapi.sdk.message.service.DefaultMessageService
import com.solapi.sdk.message.model.Message
import com.solapi.sdk.message.model.MessageType
import kotlinx.coroutines.*

fun main() = runBlocking {
    try {
        // 클라이언트 초기화
        val messageService = SolapiClient.createInstance("YOUR_API_KEY", "YOUR_API_SECRET")
        
        // 여러 메시지를 비동기적으로 발송
        val jobs = listOf(
            async { sendMessage(messageService, "01012345678", "첫 번째 메시지") },
            async { sendMessage(messageService, "01011111111", "두 번째 메시지") },
            async { sendMessage(messageService, "01022222222", "세 번째 메시지") }
        )
        
        // 모든 작업 완료 대기
        val results = jobs.awaitAll()
        
        println("모든 메시지 발송 완료:")
        results.forEach { result ->
            println("메시지 ID: \${result.messageList.first().messageId}")
            println("상태: \${result.messageList.first().statusCode}")
            println("---")
        }
        
    } catch (e: Exception) {
        System.err.println("메시지 발송 실패: \${e.message}")
    }
}

suspend fun sendMessage(messageService: DefaultMessageService, to: String, text: String) = withContext(Dispatchers.IO) {
    val message = Message().apply {
        this.to = to
        from = "01087654321"
        this.text = text
        type = MessageType.SMS
    }
    
    messageService.send(message)
}`,
        usage: 'Kotlin에서 비동기적으로 여러 메시지를 발송해야 하는 경우',
        url: 'https://github.com/solapi/solapi-java'
      }
    ];
  }

  /**
   * 카테고리별 예제 코드 반환
   * @param category - 카테고리명
   * @returns 해당 카테고리의 예제 코드 배열
   */
  static getExamplesByCategory(category: string): Example[] {
    return this.getExamples().filter(example => 
      example.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * ID로 특정 예제 코드 반환
   * @param id - 예제 ID
   * @returns 해당 ID의 예제 코드 또는 null
   */
  static getExampleById(id: string): Example | null {
    return this.getExamples().find(example => example.id === id) || null;
  }

  /**
   * 키워드로 예제 코드 검색
   * @param keyword - 검색 키워드
   * @returns 검색된 예제 코드 배열
   */
  static searchExamples(keyword: string): Example[] {
    const lowerKeyword = keyword.toLowerCase();
    return this.getExamples().filter(example => 
      example.title.toLowerCase().includes(lowerKeyword) ||
      example.description.toLowerCase().includes(lowerKeyword) ||
      example.keywords.some(k => k.toLowerCase().includes(lowerKeyword)) ||
      example.code.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * 사용 가능한 카테고리 목록 반환
   * @returns 카테고리 배열
   */
  static getCategories(): string[] {
    const categories = new Set(this.getExamples().map(example => example.category));
    return Array.from(categories);
  }
}
