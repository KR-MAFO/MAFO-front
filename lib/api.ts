// 🔗 백엔드 API 연동 파일
// 실제 백엔드 서버와 통신하는 함수들을 정의합니다.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// 🔐 인증 관련 API
export const authAPI = {
  // 로그인
  login: async (email: string, password: string) => {
    // 🚀 TODO: 실제 로그인 API 연동
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    return response.json()
  },

  // 회원가입
  signup: async (userData: {
    name: string
    email: string
    password: string
  }) => {
    // 🚀 TODO: 실제 회원가입 API 연동
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
    return response.json()
  },

  // 비밀번호 재설정 이메일 전송
  sendResetEmail: async (email: string) => {
    // 🚀 TODO: 비밀번호 재설정 이메일 전송 API
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
    return response.json()
  },

  // 인증 코드 확인
  verifyResetCode: async (email: string, code: string) => {
    // 🚀 TODO: 인증 코드 확인 API
    const response = await fetch(`${API_BASE_URL}/auth/verify-reset-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    })
    return response.json()
  },

  // 비밀번호 재설정
  resetPassword: async (email: string, code: string, newPassword: string) => {
    // 🚀 TODO: 비밀번호 재설정 API
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code, newPassword }),
    })
    return response.json()
  },
}

// 👤 사용자 프로필 관련 API
export const userAPI = {
  // 프로필 조회
  getProfile: async (token: string) => {
    // 🚀 TODO: 사용자 프로필 조회 API
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.json()
  },

  // 프로필 업데이트
  updateProfile: async (token: string, profileData: any) => {
    // 🚀 TODO: 프로필 업데이트 API
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    })
    return response.json()
  },
}

// 💬 커뮤니티 관련 API
export const communityAPI = {
  // 게시글 목록 조회
  getPosts: async (token: string, sortBy: "nearby" | "popular" = "nearby") => {
    // 🚀 TODO: 게시글 목록 조회 API
    const response = await fetch(`${API_BASE_URL}/community/posts?sort=${sortBy}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.json()
  },

  // 게시글 좋아요/취소
  toggleLike: async (token: string, postId: string) => {
    // 🚀 TODO: 게시글 좋아요 토글 API
    const response = await fetch(`${API_BASE_URL}/community/posts/${postId}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.json()
  },

  // 새 게시글 작성
  createPost: async (token: string, postData: any) => {
    // 🚀 TODO: 게시글 작성 API
    const response = await fetch(`${API_BASE_URL}/community/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    })
    return response.json()
  },
}

// 📁 파일/폴더 관리 API
export const filesAPI = {
  // 폴더 목록 조회
  getFolders: async (token: string) => {
    // 🚀 TODO: 폴더 목록 조회 API
    const response = await fetch(`${API_BASE_URL}/files/folders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.json()
  },

  // 새 폴더 생성
  createFolder: async (token: string, folderName: string) => {
    // 🚀 TODO: 폴더 생성 API
    const response = await fetch(`${API_BASE_URL}/files/folders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: folderName }),
    })
    return response.json()
  },

  // 장소 저장
  savePlace: async (token: string, folderId: string, placeData: any) => {
    // 🚀 TODO: 장소 저장 API
    const response = await fetch(`${API_BASE_URL}/files/folders/${folderId}/places`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(placeData),
    })
    return response.json()
  },
}

// 🗺️ 지도 관련 API
export const mapAPI = {
  // 주변 장소 검색
  searchNearbyPlaces: async (token: string, lat: number, lng: number, radius = 1000) => {
    // 🚀 TODO: 주변 장소 검색 API (Kakao Map API 연동)
    const response = await fetch(`${API_BASE_URL}/map/nearby?lat=${lat}&lng=${lng}&radius=${radius}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.json()
  },

  // 장소 상세 정보 조회
  getPlaceDetails: async (token: string, placeId: string) => {
    // 🚀 TODO: 장소 상세 정보 API
    const response = await fetch(`${API_BASE_URL}/map/places/${placeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.json()
  },
}

// ⚙️ 설정 관련 API
export const settingsAPI = {
  // 사용자 설정 조회
  getSettings: async (token: string) => {
    // 🚀 TODO: 사용자 설정 조회 API
    const response = await fetch(`${API_BASE_URL}/user/settings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.json()
  },

  // 사용자 설정 업데이트
  updateSettings: async (token: string, settings: any) => {
    // 🚀 TODO: 사용자 설정 업데이트 API
    const response = await fetch(`${API_BASE_URL}/user/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    })
    return response.json()
  },
}
