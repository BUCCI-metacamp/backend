/**
 * @swagger
 * /reports:
 *  post:
 *    summary: 업무 일지 등록
 *    description: 로그인한 사용자가 업무 일지를 등록합니다.
 *    tags: [Reports]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                description: 업무 일지의 제목
 *              content:
 *                type: string
 *                description: 업무 일지의 내용
 *            required:
 *              - title
 *              - content
 *            example:
 *              title: "회의 기록"
 *              content: "2024년 7월 22일 회의 내용"
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: 업무 일지가 성공적으로 등록됨
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  type: string
 *                  description: 등록한 사용자의 ID
 *                title:
 *                  type: string
 *                  description: 업무 일지의 제목
 *                content:
 *                  type: string
 *                  description: 업무 일지의 내용
 *                createdAt:
 *                  type: string
 *                  format: date-time
 *                  description: 업무 일지 등록 시간
 *              example:
 *                userId: "1"
 *                title: "회의 기록"
 *                content: "2024년 7월 22일 회의 내용"
 *                createdAt: "2024-07-22T10:00:00.000Z"
 *      400:
 *        description: 잘못된 요청 (제목 또는 내용이 누락된 경우)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "Bad Request: Title and content are required."
 *      401:
 *        description: 인증 실패 (사용자 인증이 필요함)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "Unauthorized"
 *      500:
 *        description: 서버 오류
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "서버 오류 발생"
 */

/**
 * @swagger
 * /reports:
 *  get:
 *    summary: 업무 일지 리스트 조회
 *    description: 관리자가 업무 일지의 목록을 조회합니다.
 *    tags: [Reports]
 *    parameters:
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          default: 10
 *        description: 반환할 업무 일지의 최대 수
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *          default: 1
 *        description: 조회할 페이지 번호
 *      - in: query
 *        name: title
 *        schema:
 *          type: string
 *        description: 조회할 제목
 *      - in: query
 *        name: content
 *        schema:
 *          type: string
 *        description: 조회할 내용
 *      - in: query
 *        name: userName
 *        schema:
 *          type: string
 *        description: 조회할 작성자 이름
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: 업무 일지 목록이 성공적으로 조회됨
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                totalCount:
 *                  type: integer
 *                  description: 전체 업무 일지 수
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                        description: 업무 일지 ID
 *                      title:
 *                        type: string
 *                        description: 업무 일지의 제목
 *                      createdAt:
 *                        type: string
 *                        format: date-time
 *                        description: 업무 일지 등록 시간
 *                      updatedAt:
 *                        type: string
 *                        format: date-time
 *                        description: 업무 일지 수정 시간
 *                      author:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: integer
 *                            description: 작성자 ID
 *                          name:
 *                            type: string
 *                            description: 작성자 이름
 *                          userId:
 *                            type: string
 *                            description: 작성자 사용자 ID
 *              example:
 *                id: 1
 *                title: "회의 기록"
 *                createdAt: "2024-07-22T04:12:35.289Z"
 *                updatedAt: "2024-07-22T04:12:35.289Z"
 *                author:
 *                  id: 1
 *                  name: "관리자"
 *                  userId: "admin"
 *      401:
 *        description: 인증 실패 (사용자 인증이 필요함)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "Unauthorized"
 *      403:
 *        description: 권한 부족 (관리자 권한이 필요함)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "Forbidden"
 *      500:
 *        description: 서버 오류
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "서버 오류 발생"
 */

/**
 * @swagger
 * /reports/{id}:
 *  get:
 *    summary: 업무 일지 조회
 *    description: 관리자가 특정 업무 일지의 상세 정보를 조회합니다.
 *    tags: [Reports]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: 조회할 업무 일지의 ID
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: 업무 일지 상세 정보가 성공적으로 조회됨
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                  description: 업무 일지 ID
 *                title:
 *                  type: string
 *                  description: 업무 일지의 제목
 *                content:
 *                  type: string
 *                  description: 업무 일지의 내용
 *                createdAt:
 *                  type: string
 *                  format: date-time
 *                  description: 업무 일지 등록 시간
 *                updatedAt:
 *                  type: string
 *                  format: date-time
 *                  description: 업무 일지 수정 시간
 *                deletedAt:
 *                  type: string
 *                  format: date-time
 *                  nullable: true
 *                  description: 업무 일지 삭제 시간 (삭제되지 않은 경우 `null`)
 *                userId:
 *                  type: integer
 *                  description: 등록한 사용자의 ID
 *                author:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: integer
 *                      description: 작성자 ID
 *                    name:
 *                      type: string
 *                      description: 작성자 이름
 *                    userId:
 *                      type: string
 *                      description: 작성자 사용자 ID
 *              example:
 *                id: 1
 *                title: "회의 기록"
 *                content: "2024년 7월 22일 회의 내용"
 *                createdAt: "2024-07-22T04:12:35.289Z"
 *                updatedAt: "2024-07-22T04:12:35.289Z"
 *                deletedAt: null
 *                userId: 1
 *                author:
 *                  id: 1
 *                  name: "관리자"
 *                  userId: "admin"
 *      401:
 *        description: 인증 실패 (사용자 인증이 필요함)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "Unauthorized"
 *      403:
 *        description: 권한 부족 (관리자 권한이 필요함)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "Forbidden"
 *      404:
 *        description: 업무 일지를 찾을 수 없음
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "Not Found: Report with the given ID does not exist."
 *      500:
 *        description: 서버 오류
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "서버 오류 발생"
 */

/**
 * @swagger
 * /reports/product-data:
 *  get:
 *    summary: 업무 일지 생산 데이터 조회
 *    description: 관리자가 최근 공장 가동 시간 동안의 생산 정보를 조회합니다.
 *    tags: [Reports]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: 업무 일지 상세 정보가 성공적으로 조회됨
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                uptime:
 *                  type: string
 *                  description: 가동 시작 시간
 *                endTime:
 *                  type: string
 *                  description: 가동 종료 시간
 *                good:
 *                  type: int
 *                  description: 양품 카운트
 *                bad:
 *                  type: int
 *                  description: 불량 카운트
 *              example:
 *                uptime: "2024-08-01T10:53:56.196Z"
 *                endTime: "2024-08-01T11:14:42.224Z"
 *                good: 11
 *                bad: 4
 *      401:
 *        description: 인증 실패 (사용자 인증이 필요함)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "Unauthorized"
 *      403:
 *        description: 권한 부족 (관리자 권한이 필요함)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "Forbidden"
 *      404:
 *        description: 업무 일지를 찾을 수 없음
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "Not Found: Report with the given ID does not exist."
 *      500:
 *        description: 서버 오류
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "서버 오류 발생"
 */

/**
 * @swagger
 * /reports/{id}:
 *  delete:
 *    summary: 업무 일지 삭제
 *    description: 특정 업무 일지를 ID로 삭제합니다.
 *    tags: [Reports]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: 삭제할 업무 일지의 ID
 *    responses:
 *      200:
 *        description: 업무 일지가 성공적으로 삭제됨
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *      400:
 *        description: 잘못된 요청 (잘못된 ID 형식 등)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "Invalid report ID format"
 *      404:
 *        description: 업무 일지를 찾을 수 없음
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "Report not found"
 *      500:
 *        description: 서버 오류
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "Internal server error"
 */
